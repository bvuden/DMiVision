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
    public class FeaturesController : Controller
    {
        private VisionContext _dbContext;

        public FeaturesController(VisionContext dbContext)
        {
            var created = dbContext.Database.EnsureCreated();
            _dbContext = dbContext;
        }

        [ResourceAuthorize("Read", "Features")]
        [HttpGet]
        public IEnumerable<Feature> Get()
        {
            return _dbContext.Features;
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var feature = _dbContext.Features.Include(x => x.Votes).ToList().FirstOrDefault(x => x.Id == id);

            if (feature != null && feature.AuthorId == GetAuthenticatedUserId())
            {
                var model = new FeatureAddOrEdit(feature.Title, feature.Description);
                var authorVote = feature.Votes.FirstOrDefault(v => v.VoterId == GetAuthenticatedUserId());
                model.AuthorGivenVotePoints = authorVote != null ? authorVote.Points : 0;
                return new ObjectResult(model);
            }
            return new BadRequestResult();
        }

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
                if (model.AuthorGivenVotePoints > 0)
                {
                    var vote = new Vote(feature.AuthorId, model.AuthorGivenVotePoints);
                    feature.Votes.Add(vote);
                }
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

            if (ModelState.IsValid && feature != null && feature.AuthorId == GetAuthenticatedUserId())
            {
                feature.Title = model.Title;
                feature.Description = model.Description;
                feature.DateModified = DateTime.Now;

                //get creator own vote
                var authorVote = feature.Votes.FirstOrDefault(x => x.VoterId == feature.AuthorId);
                authorVote.Points = model.AuthorGivenVotePoints;

                _dbContext.SaveChanges();
                return new HttpStatusCodeResult(200);
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


        private string GetAuthenticatedUserId()
        {
            Claim subject = Request.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "sub");
            return subject.Value;
        }

        private int GetAvailableVotePointsForUser(string userId)
        {
            //todo make max amount configurable
            const int maxPoints = 100;
            // get spend vote points
            var spentPoints = _dbContext.Votes.Where(v => v.VoterId == userId).Sum(x => x.Points);
            return maxPoints - spentPoints;
        }
    }
}
