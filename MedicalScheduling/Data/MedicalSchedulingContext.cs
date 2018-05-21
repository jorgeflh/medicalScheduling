using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MedicalScheduling.Models;

    public class MedicalSchedulingContext : DbContext
    {
        public MedicalSchedulingContext (DbContextOptions<MedicalSchedulingContext> options)
            : base(options)
        {
        }

        public DbSet<MedicalScheduling.Models.Users> Users { get; set; }
    }
