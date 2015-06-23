using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Diagnostics.Entity;
using Microsoft.AspNet.Hosting;
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

            services.ConfigureCors(
                options =>
                    options.AddPolicy("allowSpecificOrigin", builder => builder
                        .WithOrigins(Configuration["Data:CORS:AllowedOrigins"])
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        )
                );
            
            services.AddMvc();

            // Register Entity Framework
            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<VisionContext>(options =>
                {
                    options.UseSqlServer(Configuration["Data:DefaultConnection:ConnectionString"]);
                });
        }

        // Configure is called after ConfigureServices is called.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseAppBuilder(o => o.UseResourceAuthorization(new Helpers.AuthorizationManager()));

            app.UseAppBuilder(
                o => o.UseIdentityServerBearerTokenAuthentication(new IdentityServerBearerTokenAuthenticationOptions
                {
                    Authority = Configuration.Get("SecurityTokenService:Authority"),
                    RequiredScopes = new[] { "dmivisionapi", "profile" }
                })
            );

            //add cors to the request pipeline
            if (env.IsEnvironment("Development"))
            {
                app.UseCors("allowAll");
                app.UseErrorPage(ErrorPageOptions.ShowAll);
                app.UseDatabaseErrorPage(DatabaseErrorPageOptions.ShowAll);
            }
            else
            {
                app.UseCors("allowSpecificOrigin");
            }

            // Add MVC to the request pipeline.
            app.UseMvc();
        }
    }
}
