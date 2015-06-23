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
        public DbSet<Vote> Votes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //base.OnModelCreating(modelBuilder);

            //required for Azure SQL v11
            //https://github.com/aspnet/EntityFramework/issues/1960
            modelBuilder.ForSqlServer().UseIdentity();

        }
    }
}
