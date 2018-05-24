using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedicalScheduling.Models
{
    public class Schedules
    {
        public int Id { get; set; }

        public int DoctorId { get; set; }
        public virtual Doctors Doctor { get; set; }

        public int PatientId { get; set; }
        public virtual Patients Patient { get; set; }

        public DateTime Date { get; set; }
    }
}
