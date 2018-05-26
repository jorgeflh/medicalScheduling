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
    [Route("api/Patients")]
    public class PatientsController : Controller
    {
        private readonly MedicalSchedulingContext _context;

        public PatientsController(MedicalSchedulingContext context)
        {
            _context = context;
        }

        // GET: api/Patients
        [Route("~/api/GetAllPatients")]
        [HttpGet]
        public IEnumerable<Patients> GetPatients()
        {
            return _context.Patients;
        }

        [Route("~/api/GetPatientList/{term}")]
        [HttpGet]
        public IEnumerable<Patients> GetPatientList([FromRoute] string term)
        {
            var patientsList = _context.Patients.Where(d => d.Name.Contains(term)).ToList();
            return patientsList;
        }

        // GET: api/Patients/5
        [Route("~/api/GetPatient/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatients([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var patients = await _context.Patients.SingleOrDefaultAsync(m => m.Id == id);

            if (patients == null)
            {
                return NotFound();
            }

            return Ok(patients);
        }

        // PUT: api/Patients/5
        [Route("~/api/UpdatePatient/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatients([FromRoute] int id, [FromBody] Patients patients)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != patients.Id)
            {
                return BadRequest();
            }

            _context.Entry(patients).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientsExists(id))
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

        // POST: api/Patients
        [Route("~/api/AddPatient")]
        [HttpPost]
        public async Task<IActionResult> PostPatients([FromBody] Patients patients)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Patients.Add(patients);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatients", new { id = patients.Id }, patients);
        }

        // DELETE: api/Patients/5
        [Route("~/api/DeletePatient/{id}")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatients([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var patients = await _context.Patients.SingleOrDefaultAsync(m => m.Id == id);
            if (patients == null)
            {
                return NotFound();
            }

            _context.Patients.Remove(patients);
            await _context.SaveChangesAsync();

            return Ok(patients);
        }

        private bool PatientsExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }
    }
}