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

namespace DMi.Vision.Api.Controllers
{

    [Route("api/[controller]")]
    public class FeaturesController : BaseController
    {


        public FeaturesController(VisionContext dbContext)
            : base(dbContext)
        {

        }

        [ResourceAuthorize("Read", "Features")]
        [HttpGet]
        public IActionResult Get()
        {
            var features = _dbContext.Features.Include(f => f.Votes);
            var userId = GetAuthenticatedUserId();
            var model = new FeatureList { UserAvailableVotePoints = GetAvailableVotePointsForUser(userId) };
            foreach (var feature in features)
            {
                var item = new FeatureListItem
                {
                    Id = feature.Id,
                    Title = feature.Title,
                    Description = feature.Description,
                    AuthorId = feature.AuthorId,
                    TotalGivenVotePoints = feature.Votes.Sum(x => x.Points),
                };
                var userVote = feature.Votes.FirstOrDefault(x => x.VoterId == GetAuthenticatedUserId());
                item.UserGivenVotePoints = userVote != null ? userVote.Points : 0;
                model.Features.Add(item);
            }
            return new ObjectResult(model);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var feature = _dbContext.Features.Include(x => x.Votes).ToList().FirstOrDefault(x => x.Id == id);
            var userId = GetAuthenticatedUserId();


            if (feature != null)
            {
                var model = new FeatureAddOrEdit(feature.Title, feature.Description);
                model.AuthorId = feature.AuthorId;
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
                model.UserAvailableVotePoints = GetAvailableVotePointsForUser(userId);
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
            var userId = GetAuthenticatedUserId();

            if (ModelState.IsValid && feature != null && feature.AuthorId == userId)
            {
                feature.Title = model.Title;
                feature.Description = model.Description;
                feature.DateModified = DateTime.Now;

                //get author own vote (can not be null)
                var authorVote = feature.Votes.FirstOrDefault(x => x.VoterId == feature.AuthorId);

                //get max points
                var userAvailablePoints = GetAvailableVotePointsForUser(userId);
                var maxVotePoints = userAvailablePoints + authorVote.Points;
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
            Feature feature = _dbContext.Features.SingleOrDefault(x => x.Id == id);
            if (feature != null)
            {
                if (feature.AuthorId == GetAuthenticatedUserId())
                {
                    _dbContext.Features.Remove(feature);
                    _dbContext.SaveChanges();
                    return new HttpStatusCodeResult(200);
                }
            }
            return new BadRequestResult();
        }
    }
}
