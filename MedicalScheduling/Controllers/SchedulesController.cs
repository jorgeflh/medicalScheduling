using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedicalScheduling.Models;
using MedicalScheduling.DTO;

namespace MedicalScheduling.Controllers
{
    [Produces("application/json")]
    [Route("api/Schedules")]
    public class SchedulesController : Controller
    {
        private readonly MedicalSchedulingContext _context;

        public SchedulesController(MedicalSchedulingContext context)
        {
            _context = context;
        }

        // GET: api/Schedules
        [Route("~/api/GetAllSchedules")]
        [HttpGet]
        public IEnumerable<ScheduleDTO> GetSchedules()
        {
            var scheduleList = _context.Schedules;
            List<ScheduleDTO> scheduleDTOList = new List<ScheduleDTO>();

            foreach (var item in scheduleList)
            {
                ScheduleDTO scheduleDTO = new ScheduleDTO
                {
                    Id = item.Id,
                    DoctorId = item.DoctorId,
                    DoctorName = _context.Doctors.Where(d => d.Id == item.DoctorId).SingleOrDefault().Name,
                    PatientId = item.PatientId,
                    PatientName = _context.Patients.Where(p => p.Id == item.PatientId).SingleOrDefault().Name,
                    Date = item.Date.ToShortDateString(),
                    Time = item.Date.ToShortTimeString()
                };
                scheduleDTOList.Add(scheduleDTO);
            }

            return scheduleDTOList.OrderByDescending(s => s.Date).ThenBy(s => s.Time);
        }

        // GET: api/Schedules/5
        [Route("~/api/GetSchedule/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSchedules([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schedule = await _context.Schedules.SingleOrDefaultAsync(m => m.Id == id);

            if (schedule == null)
            {
                return NotFound();
            }

            ScheduleDTO scheduleDTO = new ScheduleDTO
            {
                Id = schedule.Id,
                DoctorId = schedule.DoctorId,
                DoctorName = _context.Doctors.Where(d => d.Id == schedule.DoctorId).SingleOrDefault().Name,
                PatientId = schedule.PatientId,
                PatientName = _context.Patients.Where(d => d.Id == schedule.PatientId).SingleOrDefault().Name,
                Date = schedule.Date.ToString("yyyy-MM-dd"),
                Time = schedule.Date.ToShortTimeString()
            };
           
            return Ok(scheduleDTO);
        }

        // PUT: api/Schedules/5
        [Route("~/api/UpdateSchedule/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSchedules([FromRoute] int id, [FromBody] Schedules schedules)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != schedules.Id)
            {
                return BadRequest();
            }

            _context.Entry(schedules).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SchedulesExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Schedules
        [Route("~/api/AddSchedule")]
        [HttpPost]
        public async Task<IActionResult> PostSchedules([FromBody] Schedules schedules)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            _context.Schedules.Add(schedules);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSchedules", new { id = schedules.Id }, schedules);
        }

        // DELETE: api/Schedules/5
        [Route("~/api/DeleteSchedule/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedules([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var schedules = await _context.Schedules.SingleOrDefaultAsync(m => m.Id == id);
            if (schedules == null)
            {
                return NotFound();
            }

            _context.Schedules.Remove(schedules);
            await _context.SaveChangesAsync();

            return Ok(schedules);
        }

        private bool SchedulesExists(int id)
        {
            return _context.Schedules.Any(e => e.Id == id);
        }
    }
}