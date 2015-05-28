using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Routing;
using Microsoft.Data.Entity;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.DependencyInjection;
using Owin;
using Thinktecture.IdentityServer.AccessTokenValidation;

namespace DMi.Vision.Api
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            // Setup configuration sources.
            Configuration = new Configuration()
                .AddJsonFile("Config.json")
                .AddEnvironmentVariables();
        }

        public IConfiguration Configuration { get; set; }


        // This method gets called by a runtime.
        // Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.ConfigureCors(
                options =>
                    options.AddPolicy("allowAll", builder => builder
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        )
                    );

            // add config settings
            Configuration = new Configuration()
                .AddJsonFile("Config.json")
                //.AddJsonFile("ConfigSettings.json")
                .AddEnvironmentVariables();

            services.AddMvc();
            // Uncomment the following line to add Web API services which makes it easier to port Web API 2 controllers.
            // You will also need to add the Microsoft.AspNet.Mvc.WebApiCompatShim package to the 'dependencies' section of project.json.
            // services.AddWebApiConventions();

            // Register Entity Framework
            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<VisionContext>(options => options.UseSqlServer(Configuration["Data:DefaultConnection:ConnectionString"]));

        }

        // Configure is called after ConfigureServices is called.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseAppBuilder(o => o.UseResourceAuthorization(new Helpers.AuthorizationManager()));

            app.UseAppBuilder(
                o => o.UseIdentityServerBearerTokenAuthentication(new IdentityServerBearerTokenAuthenticationOptions
                {
                    Authority = Configuration.Get("SecurityTokenService:Authority"),
                    RequiredScopes = new[] { "dmivisionapi" }
                })
            );

            //add cors to the request pipeline
            app.UseCors("allowAll");

            // Add MVC to the request pipeline.
            app.UseMvc();
            // Add the following route for porting Web API 2 controllers.
            // routes.MapWebApiRoute("DefaultApi", "api/{controller}/{id?}");
        }
    }
}
