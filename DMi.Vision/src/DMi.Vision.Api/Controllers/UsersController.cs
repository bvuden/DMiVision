using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMi.BridgeToVnext.Attributes;
using DMi.Vision.Api.Models;
using Microsoft.AspNet.Mvc;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace DMi.Vision.Api.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : BaseController
    {

        public UsersController(VisionContext dbContext)
            :base(dbContext)
        { }


        // GET api/values/5
        [ResourceAuthorize("Read", "Users")]
        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            var userInfo =  new UserInfo(Request.HttpContext.User,_dbContext);
            return new ObjectResult(userInfo);
        }


    }
}
