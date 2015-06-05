using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DMi.Vision.Api.Controllers
{
    public abstract class BaseController : Controller
    {
        protected VisionContext _dbContext;

        public BaseController(VisionContext dbContext)
        {
            var created = dbContext.Database.EnsureCreated();
            _dbContext = dbContext;
       }
        protected string GetAuthenticatedUserId()
        {
            Claim subject = Request.HttpContext.User.Claims.FirstOrDefault(x => x.Type == "sub");
            return subject.Value;
        }
    }
}
