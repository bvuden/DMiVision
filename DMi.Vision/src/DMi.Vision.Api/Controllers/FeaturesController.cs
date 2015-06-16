using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DMi.BridgeToVnext.Attributes;
using DMi.Vision.Api.Models;
using DMi.Vision.Models;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using System.Threading;
using DMi.Vision.Api.Helpers;

namespace DMi.Vision.Api.Controllers
{

    [Route("api/[controller]")]
    public class FeaturesController : BaseController
    {
        const int maxPageSize = 10;

        public FeaturesController(VisionContext dbContext)
            : base(dbContext)
        { }

        
        [Route(null, Name = "Features")]
        [ResourceAuthorize("Read", "Features")]
        [HttpGet]
        public IActionResult Get(string sort = "-TotalGivenVotePoints", int page = 1, int pageSize = maxPageSize)
        {
            //Thread.Sleep(1000);
            var features = _dbContext.Features.Include(f => f.Votes);

            // ensure the page size isn't larger than the maximum.
            if (pageSize > maxPageSize)
            {
                pageSize = maxPageSize;
            }

            var model = new FeatureList();

            foreach (var feature in features)
            {
                var item = new FeatureListItem
                {
                    Id = feature.Id,
                    Title = feature.Title,
                    Description = feature.Description,
                    AuthorId = feature.AuthorId,
                    AuthorName = feature.AuthorName,
                    TotalGivenVotePoints = feature.Votes.Sum(x => x.Points),
                };
                var userVote = feature.Votes.FirstOrDefault(x => x.VoterId == GetAuthenticatedUserId());
                item.UserGivenVotePoints = userVote?.Points ?? 0;
                model.AddFeature(item);
            }

            // calculate data for metadata
            var totalCount = model.Features.Count();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            // apply sorting and paging
            model.Features = model.Features.ApplySort(sort).Skip(pageSize * (page - 1)).Take(pageSize);

            // create response header with pagination information
            string prevLink = page > 1 ? Url.Link("Features", new
            {
                page = page - 1,
                pageSize = pageSize,
                sort = sort
            }) : "";


            var nextLink = page < totalPages ? Url.Link("Features",
                new
                {
                    page = page + 1,
                    pageSize = pageSize,
                    sort = sort
                }) : "";

            var paginationHeader = new
            {
                currentPage = page,
                pageSize = pageSize,
                totalCount = totalCount,
                totalPages = totalPages,
                previousPageLink = prevLink,
                nextPageLink = nextLink
            };

            var jsonPagination = new List<string>();
            jsonPagination.Add(Newtonsoft.Json.JsonConvert.SerializeObject(paginationHeader));

            var access = new List<string>() { "X-Pagination" };
                        
            Context.Response.Headers.Add("X-Pagination", jsonPagination.ToArray());
            Context.Response.Headers.Add("Access-Control-Expose-Headers", access.ToArray());


            return new ObjectResult(model);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var feature = _dbContext.Features.Include(x => x.Votes).ToList().FirstOrDefault(x => x.Id == id);

            if (feature != null)
            {
                var model = new FeatureAddOrEdit(feature.Title, feature.Description);

                model.AuthorId = feature.AuthorId;
                model.AuthorName = feature.AuthorName;
                model.TotalGivenVotePoints = feature.Votes.Sum(x => x.Points);

                var userVote = feature.Votes.FirstOrDefault(v => v.VoterId == GetAuthenticatedUserId());
                if (userVote != null)
                {
                    var userGivenVote = new VoteAddOrEdit { Id = userVote.Id, Points = userVote.Points };
                    model.UserGivenVote = userGivenVote;
                }
                else
                {
                    model.UserGivenVote = new VoteAddOrEdit();
                }
                return new ObjectResult(model);
            }
            return new BadRequestResult();
        }

        // add new feature request
        [ResourceAuthorize("Write", "Features")]
        [HttpPost]
        public IActionResult Post([FromBody]FeatureAddOrEdit model)
        {
            if (ModelState.IsValid)
            {
                var feature = new Feature(model.Title, model.Description);
                feature.DateCreated = DateTime.Now;
                feature.DateModified = feature.DateCreated;
                feature.Status = FeatureStatus.UnderReview;
                feature.AuthorId = GetAuthenticatedUserId();
                feature.AuthorName = GetAuthenticatedUserName();
                _dbContext.Features.Add(feature);

                var vote = new Vote(feature.AuthorId, model.UserGivenVote.Points);
                feature.Votes.Add(vote);

                _dbContext.SaveChanges();
                return new HttpStatusCodeResult(201);
            }
            return new BadRequestObjectResult(ModelState);
        }

        [ResourceAuthorize("Write", "Features")]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody]FeatureAddOrEdit model)
        {
            var feature = _dbContext.Features.Include(f => f.Votes).FirstOrDefault(x => x.Id == id);
            var userInfo = new UserInfo(Request.HttpContext.User, _dbContext);

            if (ModelState.IsValid && feature != null && feature.AuthorId == userInfo.UserId)
            {
                feature.Title = model.Title;
                feature.Description = model.Description;
                feature.DateModified = DateTime.Now;

                //get author own vote (can not be null)
                var authorVote = feature.Votes.Single(x => x.VoterId == feature.AuthorId);

                //get max points
                var maxVotePoints = userInfo.AvailableVotePoints + authorVote.Points;
                if (model.UserGivenVote.Points > maxVotePoints)
                {
                    ModelState.AddModelError("UserGivenVotePoints", "Given points exceeds available points");
                }
                else
                {
                    //edit vote
                    authorVote.Points = model.UserGivenVote.Points;
                    _dbContext.SaveChanges();
                    return new HttpStatusCodeResult(200);
                }
            }
            return new BadRequestObjectResult(ModelState);
        }

        // DELETE api/values/5
        [ResourceAuthorize("Write", "Features")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            Feature feature = _dbContext.Features.Include(f => f.Votes).SingleOrDefault(x => x.Id == id);
            if (feature != null)
            {
                if (feature.AuthorId == GetAuthenticatedUserId())
                {
                    //Cascade on delete is not supported yet in EF7, delete votes explicitly
                    _dbContext.Votes.RemoveRange(feature.Votes);
                    _dbContext.Features.Remove(feature);
                    _dbContext.SaveChanges();
                    return new HttpStatusCodeResult(200);
                }
            }
            return new BadRequestResult();
        }
    }
}
