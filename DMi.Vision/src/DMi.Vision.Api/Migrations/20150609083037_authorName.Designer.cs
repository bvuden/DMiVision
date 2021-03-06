using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Metadata.Builders;
using Microsoft.Data.Entity.Relational.Migrations.Infrastructure;
using DMi.Vision.Api;

namespace DMi.Vision.Api.Migrations
{
    [ContextType(typeof(VisionContext))]
    partial class authorName
    {
        public override string Id
        {
            get { return "20150609083037_authorName"; }
        }
        
        public override string ProductVersion
        {
            get { return "7.0.0-beta4-12943"; }
        }
        
        public override IModel Target
        {
            get
            {
                var builder = new BasicModelBuilder()
                    .Annotation("SqlServer:ValueGeneration", "Sequence");
                
                builder.Entity("DMi.Vision.Models.Feature", b =>
                    {
                        b.Property<string>("AuthorId")
                            .Annotation("OriginalValueIndex", 0);
                        b.Property<string>("AuthorName")
                            .Annotation("OriginalValueIndex", 1);
                        b.Property<DateTime>("DateCreated")
                            .Annotation("OriginalValueIndex", 2);
                        b.Property<DateTime>("DateModified")
                            .Annotation("OriginalValueIndex", 3);
                        b.Property<string>("Description")
                            .Annotation("OriginalValueIndex", 4);
                        b.Property<int>("Id")
                            .GenerateValueOnAdd()
                            .Annotation("OriginalValueIndex", 5)
                            .Annotation("SqlServer:ValueGeneration", "Identity");
                        b.Property<int>("Status")
                            .Annotation("OriginalValueIndex", 6);
                        b.Property<string>("Title")
                            .Annotation("OriginalValueIndex", 7);
                        b.Key("Id");
                    });
                
                builder.Entity("DMi.Vision.Models.Vote", b =>
                    {
                        b.Property<int>("FeatureId")
                            .Annotation("OriginalValueIndex", 0);
                        b.Property<int>("Id")
                            .GenerateValueOnAdd()
                            .Annotation("OriginalValueIndex", 1)
                            .Annotation("SqlServer:ValueGeneration", "Identity");
                        b.Property<int>("Points")
                            .Annotation("OriginalValueIndex", 2);
                        b.Property<string>("VoterId")
                            .Annotation("OriginalValueIndex", 3);
                        b.Key("Id");
                    });
                
                builder.Entity("DMi.Vision.Models.Vote", b =>
                    {
                        b.ForeignKey("DMi.Vision.Models.Feature", "FeatureId");
                    });
                
                return builder.Model;
            }
        }
    }
}
