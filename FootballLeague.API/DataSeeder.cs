using FootballLeague.Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace FootballLeague.API
{
    public static class DataSeeder
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            // Identity servislərini çağırırıq
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();

            // 1. Rolları yaradırıq
            string[] roleNames = { "Admin", "Manager", "User" };
            foreach (var roleName in roleNames)
            {
                var roleExist = await roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // 2. Super Admin hesabını yaradırıq (Təmiz və yeni hesab)
            var adminUser = await userManager.FindByNameAsync("superadmin");
            if (adminUser == null)
            {
                adminUser = new AppUser
                {
                    UserName = "superadmin",
                    Email = "superadmin@footballleague.com",
                };

                var createPowerUser = await userManager.CreateAsync(adminUser, "Admin123!");
                if (createPowerUser.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    Console.WriteLine("TƏBRİKLƏR: SuperAdmin uğurla yaradıldı!");
                }
                else
                {
                    // Əgər yarada bilməsə, niyəsini bizə çap edəcək
                    foreach (var error in createPowerUser.Errors)
                    {
                        Console.WriteLine($"GİZLİ XƏTA: {error.Description}");
                    }
                }
            }
        }
    }
}