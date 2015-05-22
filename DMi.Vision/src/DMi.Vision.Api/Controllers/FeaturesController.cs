﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMi.Vision.Api.Models;
using DMi.Vision.Models;
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

        // GET: api/values
        [HttpGet]
        public IEnumerable<Feature> Get()
        {
            return _dbContext.Features;
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public IActionResult Post([FromBody]FeatureAddOrEdit model)
        {
            //TODO; validate viewmodel
            var feature = new Feature(model.Title, model.Description);
            feature.DateCreated = DateTime.Now;
            feature.DateModified = feature.DateCreated;

            _dbContext.Add(feature);
            _dbContext.SaveChanges();
            return new HttpStatusCodeResult(201);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody]FeatureAddOrEdit model)
        {
            //TODO; validate viewmodel
            Feature feature = _dbContext.Features.SingleOrDefault(x => x.Id == id);
            if (feature != null)
            {
                feature.Title = model.Title;
                feature.Description = model.Description;
                feature.DateModified = DateTime.Now;
            }
            _dbContext.SaveChanges();
            return new ObjectResult(feature);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
