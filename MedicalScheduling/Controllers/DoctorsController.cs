using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedicalScheduling.Models;

namespace MedicalScheduling.Controllers
{
    [Produces("application/json")]
    [Route("api/Doctors")]
    public class DoctorsController : Controller
    {
        private readonly MedicalSchedulingContext _context;

        public DoctorsController(MedicalSchedulingContext context)
        {
            _context = context;
        }

        // GET: api/Doctors
        [Route("~/api/GetAllDoctors")]
        [HttpGet]
        public IEnumerable<Doctors> GetDoctors()
        {
            return _context.Doctors;
        }

        [Route("~/api/GetDoctorList/{term}")]
        [HttpGet]
        public IEnumerable<Doctors> GetDoctorList(string term)
        {
            var doctorsList = _context.Doctors.Where(d => d.Name.Contains(term)).ToList();
            return doctorsList;
        }

        // GET: api/Doctors/5
        [Route("~/api/GetDoctor/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctors([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var doctor = await _context.Doctors.SingleOrDefaultAsync(m => m.Id == id);

            if (doctor == null)
            {
                return NotFound();
            }

            return Ok(doctor);
        }

        // PUT: api/Doctors/5
        [Route("~/api/UpdateDoctor/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDoctors([FromRoute] int id, [FromBody] Doctors doctors)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != doctors.Id)
            {
                return BadRequest();
            }

            _context.Entry(doctors).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DoctorsExists(id))
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

        // POST: api/Doctors
        [Route("~/api/AddDoctor/")]
        [HttpPost]
        public async Task<IActionResult> PostDoctors([FromBody] Doctors doctors)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Doctors.Add(doctors);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDoctors", new { id = doctors.Id }, doctors);
        }

        // DELETE: api/Doctors/5
        [Route("~/api/DeleteDoctor/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctors([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var doctors = await _context.Doctors.SingleOrDefaultAsync(m => m.Id == id);
            if (doctors == null)
            {
                return NotFound();
            }

            _context.Doctors.Remove(doctors);
            await _context.SaveChangesAsync();

            return Ok(doctors);
        }

        private bool DoctorsExists(int id)
        {
            return _context.Doctors.Any(e => e.Id == id);
        }
    }
}