using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DMi.BridgeToVnext.Attributes;
using DMi.Vision.Api.Models;
using DMi.Vision.Models;
using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DMi.Vision.Api.Controllers
{
    [Route("api/features/{featureId}/[controller]")]
    public class VotesController : BaseController
    {

        public VotesController(VisionContext dbContext)
            : base(dbContext)
        {

        }

        // GET: api/values
        [HttpGet]
        public IActionResult Get(int featureId)
        {
            var feature = _dbContext.Features.FirstOrDefault(f => f.Id == featureId);
            if (feature != null)
            {
                return new ObjectResult(feature.Votes);
            }
            return new BadRequestResult();
        }

        //// GET api/features/1/votes/5
        //[HttpGet("{id}")]
        //public IActionResult Get(int featureId, int id)
        //{
        //    throw new NotImplementedException();
        //}

        // POST api/values
        [ResourceAuthorize("Write", "Votes")]
        [HttpPost]
        public IActionResult Post(int featureId, [FromBody]VoteAddOrEdit model)
        {
            //TODO validate points for user (maxAvailable etc.)

            // get vote for current user for the feature request
            var userInfo = new UserInfo(Request.HttpContext.User, _dbContext);
            var vote = _dbContext.Votes.SingleOrDefault(v => v.FeatureId == featureId && v.VoterId == userInfo.UserId);
            var maxVotePoints = vote != null ? userInfo.AvailableVotePoints + vote.Points : userInfo.AvailableVotePoints;

            //validate
            if (model.Points > maxVotePoints)
            {
                ModelState.AddModelError("UserGivenVotePoints", "Given points exceeds available points");            
            }

            if (ModelState.IsValid)
            {
                if (vote != null)
                {
                    vote.Points = model.Points;
                }
                else
                {
                    //user did not vote on this feature request before
                    var newVote = new Vote(userInfo.UserId, model.Points);
                    newVote.FeatureId = featureId;
                   _dbContext.Votes.Add(newVote);                   
                }

                _dbContext.SaveChanges();
                return new HttpStatusCodeResult(201);
            }
            return new BadRequestObjectResult(ModelState);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        [ResourceAuthorize("Write", "Votes")]
        // DELETE api/values/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int featureId, int id)
        {
            var userId = Request.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "sub").Value;
            var vote = _dbContext.Votes.Include(v=>v.Feature).ToList().SingleOrDefault(v => v.Id == id);
            //you can only delete your own vote
            if (vote != null && vote.VoterId == userId)
            {
                //only delete vote if the vote is not from the original author of the feature request
                if (vote.Feature.AuthorId != vote.VoterId) {
                    _dbContext.Votes.Remove(vote);
                    _dbContext.SaveChanges();
                    return new HttpStatusCodeResult(200);
                }
                ModelState.AddModelError("", "You can't revoke votes on your own feature request.");                
            }
            return new BadRequestObjectResult(ModelState);
            
        }
    }
}
