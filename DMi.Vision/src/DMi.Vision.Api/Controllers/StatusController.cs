using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMi.BridgeToVnext.Attributes;
using DMi.Vision.Api.Models;
using DMi.Vision.Models;
using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DMi.Vision.Api.Controllers
{    
    public class StatusController : BaseController
    {
        public StatusController(VisionContext dbContext)
            : base(dbContext)
        {

        }

        [Route("api/[controller]")]
        [ResourceAuthorize("Read", "Status")]
        [HttpGet]
        public IActionResult Get()
        {
            //return enum as jspm object
            var enumVals = new List<object>();
            foreach (var item in Enum.GetValues(typeof(FeatureStatus)))
            {
                enumVals.Add(new
                {
                    id = item,
                    name = item.ToString()
                });
            }
            return new ObjectResult(enumVals);
        }

        [Route("api/features/{featureId}/[controller]")]
        [ResourceAuthorize("Write", "Status")]
        [HttpGet("{featureId}")]
        public IActionResult Get(int featureId)
        {
            Feature feature = _dbContext.Features.SingleOrDefault(x => x.Id == featureId);
            if (feature != null)
            {
                var model = new FeatureChangeStatus(feature.Title, feature.Status);
                return new ObjectResult(model);
            }
            return new BadRequestResult();
        }

        //// GET api/values/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST api/values
        //[HttpPost]
        //public void Post([FromBody]string value)
        //{
        //}

        //// PUT api/values/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE api/values/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
