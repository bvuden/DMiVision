using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMi.Vision.Models;
using Microsoft.Data.Entity;

namespace DMi.Vision.Api
{
    public class VisionContext : DbContext
    {
        public VisionContext() { }

        public DbSet<Feature> Features { get; set; }
    }
}
