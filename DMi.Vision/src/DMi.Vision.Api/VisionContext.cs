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
        public VisionContext() {

        }

        public DbSet<Feature> Features { get; set; }
        public DbSet<Vote> Votes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Feature>(b =>
            {
                b.Key(e => e.Id);
                b.Property(e => e.Id).ForSqlServer().UseIdentity();
            });

            //modelBuilder.Entity<Feature>()
            //    .Collection(f => f.Votes)
            //    .InverseReference(v => v.Feature)
            //    .ForeignKey(v=>v.FeatureId);

            modelBuilder.Entity<Vote>(b =>
            {
                b.Key(e => e.Id);
                b.Property(e => e.Id).ForSqlServer().UseIdentity();
            });
        }
    }
}
