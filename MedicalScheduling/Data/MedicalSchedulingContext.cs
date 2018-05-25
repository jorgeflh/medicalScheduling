using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MedicalScheduling.Models;

namespace MedicalScheduling
{
    public class MedicalSchedulingContext : DbContext
    {
        public MedicalSchedulingContext(DbContextOptions<MedicalSchedulingContext> options)
            : base(options)
        {
        }

        public DbSet<MedicalScheduling.Models.Users> Users { get; set; }

        public DbSet<MedicalScheduling.Models.Patients> Patients { get; set; }

        public DbSet<MedicalScheduling.Models.Doctors> Doctors { get; set; }

        public DbSet<MedicalScheduling.Models.Schedules> Schedules { get; set; }
    }

}