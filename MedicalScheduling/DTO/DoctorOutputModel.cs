﻿using MedicalScheduling.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MedicalScheduling.DTO
{
    public class DoctorOutputModel
    {
        public PagingHeader Paging { get; set; }
        public List<LinkInfo> Links { get; set; }
        public List<Doctors> Items { get; set; }
    }
}
