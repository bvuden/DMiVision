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
            var feature = _dbContext.Features.SingleOrDefault(x => x.Id == id);
            if (feature != null)
            {
                return new ObjectResult(feature);
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
                feature.AuthorId = GetAuthenticatedUserId();

                _dbContext.Add(feature);
                _dbContext.SaveChanges();
                return new HttpStatusCodeResult(201);
            }
            return new BadRequestObjectResult(ModelState);
        }

        [ResourceAuthorize("Write", "Features")]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody]FeatureAddOrEdit model)
        {
            Feature feature = _dbContext.Features.SingleOrDefault(x => x.Id == id);

            if (ModelState.IsValid && feature.AuthorId == GetAuthenticatedUserId())
            {
                if (feature != null)
                {
                    feature.Title = model.Title;
                    feature.Description = model.Description;
                    feature.DateModified = DateTime.Now;
                }
                _dbContext.SaveChanges();
                return new ObjectResult(feature);
            }
            return new BadRequestObjectResult(ModelState);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }


        private string GetAuthenticatedUserId()
        {
            Claim subject = Request.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "sub");
            return subject.Value;
        }
    }
}
