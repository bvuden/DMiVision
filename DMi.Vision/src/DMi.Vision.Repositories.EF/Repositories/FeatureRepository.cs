using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMi.Vision.Models;
using DMi.Vision.Models.Repositories;

namespace DMi.Vision.Repositories.EF.Repositories
{
    public class FeatureRepository : Repository<Feature>, IFeatureRepository
    {
        public FeatureRepository(VisionContext dbContext)
            : base(dbContext)
        {

        }
    }
}
