using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNet.DataProtection;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Owin.Builder;
using Owin;

namespace Microsoft.AspNet.Builder
{

	using AppFunc = Func<IDictionary<string, object>, Task>;
	using DataProtectionProviderDelegate = Func<string[], Tuple<Func<byte[], byte[]>, Func<byte[], byte[]>>>;
	using DataProtectionTuple = Tuple<Func<byte[], byte[]>, Func<byte[], byte[]>>;


	/// <summary>
	/// based on:
	/// https://github.com/aspnet/Entropy/blob/dev/samples/Owin.IAppBuilderBridge/KAppBuilderExtensions.cs
	/// https://gitter.im/IdentityServer/IdentityServer3/archives/2015/04/08
	/// </summary>
	public static class ApplicationBuilderExtensions
	{
		public static IApplicationBuilder UseAppBuilder(this IApplicationBuilder app, Action<IAppBuilder> configure)
		{
			app.UseOwin(addToPipeline =>
			{
				addToPipeline(next =>
				{
					var appBuilder = new AppBuilder();
					var provider = app.ApplicationServices.GetRequiredService<IDataProtectionProvider>();

					appBuilder.Properties["builder.DefaultApp"] = next;
					appBuilder.Properties["host.AppName"] = "test";
					appBuilder.Properties["security.DataProtectionProvider"] = new DataProtectionProviderDelegate(purposes =>
					{
						var dataProtection = provider.CreateProtector(string.Join(",", purposes));
						return new DataProtectionTuple(dataProtection.Protect, dataProtection.Unprotect);
					});
					configure(appBuilder);

					return appBuilder.Build<AppFunc>();
				});
			});
			return app;
		}

		//public static IAppBuilder SetDataProtectionProvider(this IAppBuilder appBuilder, IApplicationBuilder app)
		//{
		//	var provider = app.ApplicationServices.GetRequiredService<IDataProtectionProvider>();
		//	appBuilder.Properties["security.DataProtectionProvider"] = new DataProtectionProviderDelegate(purposes =>
		//	{
		//		var dataProtection = provider.CreateProtector(string.Join(",", purposes));				
		//		return new DataProtectionTuple(dataProtection.Protect, dataProtection.Unprotect);
		//	});
		//	return appBuilder;
		//}


		//public static void UseCookieAuthentication(this IApplicationBuilder app, CookieAuthenticationOptions options)
		//{
		//	app.UseOwin(addToPipeline =>
		//	{
		//		addToPipeline(next =>
		//		{


		//			var builder = new Microsoft.Owin.Builder.AppBuilder();

		//			var provider = app.ApplicationServices.GetService<Microsoft.AspNet.Security.DataProtection.IDataProtectionProvider>();

		//			builder.Properties["security.DataProtectionProvider"] = new DataProtectionProviderDelegate(purposes =>
		//			{
		//				var dataProtection = provider.CreateProtector(String.Join(",", purposes));
		//				return new DataProtectionTuple(dataProtection.Protect, dataProtection.Unprotect);
		//			});

		//			builder.UseCookieAuthentication(options);

		//			var appFunc = builder.Build(typeof(Func<IDictionary<string, object>, Task>)) as Func<IDictionary<string, object>, Task>;
		//			return appFunc;
		//		});
		//	});
		//}


	}
}