using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DMi.Vision.Api.Controllers
{
    [Route("api/features/{featureId}/[controller]")]
    public class VotesController : Controller
    {
        private VisionContext _dbContext;

        public VotesController(VisionContext dbContext)
        {
            var created = dbContext.Database.EnsureCreated();
            _dbContext = dbContext;
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
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
