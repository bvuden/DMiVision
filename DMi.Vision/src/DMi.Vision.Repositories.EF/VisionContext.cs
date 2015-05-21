using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMi.Vision.Models;
using Microsoft.Data.Entity;

namespace DMi.Vision.Repositories.EF
{
    public class VisionContext :DbContext
    {
        /// <summary>
        /// Provides access to the collection of features in the system.
        /// </summary>
        public DbSet<Feature> Features { get; set; }
    }
}
