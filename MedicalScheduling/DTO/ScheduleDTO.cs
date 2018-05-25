using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedicalScheduling.DTO
{
    public class ScheduleDTO
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public String DoctorName { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
    }
}
