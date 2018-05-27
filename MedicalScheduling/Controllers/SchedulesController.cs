using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MedicalScheduling.Models;
using MedicalScheduling.DTO;
using MedicalScheduling.Types;

namespace MedicalScheduling.Controllers
{
    [Produces("application/json")]
    [Route("api/Schedules")]
    public class SchedulesController : Controller
    {
        private readonly MedicalSchedulingContext _context;
        private readonly IUrlHelper urlHelper;

        public SchedulesController(MedicalSchedulingContext context, IUrlHelper urlHelper)
        {
            _context = context;
            this.urlHelper = urlHelper;
        }

        // GET: api/Schedules
        [Route("~/api/GetAllSchedules", Name = "GetAllSchedules")]
        [HttpGet]
        public IActionResult GetSchedules(PagingParams pagingParams, int doctorId = 0)
        {
            IQueryable<Schedules> query = null;

            if (doctorId <= 0)
            {
                query = _context.Schedules.AsQueryable().OrderBy(s => s.Date);
            }
            else
            {
                query = _context.Schedules.AsQueryable().Where(s => s.DoctorId == doctorId).OrderBy(s => s.Date);
            }

            var model = new PagedList<Schedules>(query, pagingParams.PageNumber, pagingParams.PageSize);
            Response.Headers.Add("X-Pagination", model.GetHeader().ToJson());

            var schedulePaging = new SchedulePaging
            {
                Paging = model.GetHeader(),
                Links = GetLinks(model),
                Items = model.List.ToList()
            };

            List<ScheduleDTO> scheduleDTOList = new List<ScheduleDTO>();

            foreach (var item in schedulePaging.Items)
            {
                ScheduleDTO scheduleDTO = new ScheduleDTO
                {
                    Id = item.Id,
                    DoctorId = item.Id,
                    DoctorName = _context.Doctors.Where(d => d.Id == item.DoctorId).SingleOrDefault().Name,
                    PatientId = item.PatientId,
                    PatientName = _context.Patients.Where(p => p.Id == item.PatientId).SingleOrDefault().Name,
                    Date = item.Date.ToShortDateString(),
                    Time = item.Date.ToShortTimeString()
                };
                scheduleDTOList.Add(scheduleDTO);
            }

            var scheduleOutputModel = new ScheduleOutputModel
            {
                Paging = schedulePaging.Paging,
                Links = schedulePaging.Links,
                Items = scheduleDTOList
            };

            return Ok(scheduleOutputModel);
        }

        // GET: api/Schedules/5
        [Route("~/api/GetSchedule/{id}")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSchedule([FromRoute] int id)
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

            var scheduleExist = _context.Schedules
                .Where(s => s.DoctorId == schedules.DoctorId
                            && s.PatientId != schedules.PatientId
                            && s.Date == schedules.Date)
                .SingleOrDefault();

            if (scheduleExist == null && schedules.Date >= DateTime.Now)
            {
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

            return BadRequest("Horário indisponível nesta data!");
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

            var scheduleExist = _context.Schedules.Where(s => s.DoctorId == schedules.DoctorId
                                        && s.Date == schedules.Date)
                                        .SingleOrDefault();

            if (scheduleExist == null && schedules.Date >= DateTime.Now)
            {
                _context.Schedules.Add(schedules);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetSchedules", new { id = schedules.Id }, schedules);
            }

            return BadRequest("Horário indisponível nesta data!");
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

        private List<LinkInfo> GetLinks(PagedList<Schedules> list)
        {
            var links = new List<LinkInfo>();

            if (list.HasPreviousPage)
                links.Add(CreateLink("GetAllSchedules", list.PreviousPageNumber, list.PageSize, "previousPage", "GET"));

            links.Add(CreateLink("GetAllSchedules", list.PageNumber, list.PageSize, "self", "GET"));

            if (list.HasNextPage)
                links.Add(CreateLink("GetAllSchedules", list.NextPageNumber, list.PageSize, "nextPage", "GET"));

            return links;
        }

        private LinkInfo CreateLink(string routeName, int pageNumber, int pageSize, string rel, string method)
        {
            var link = urlHelper.Link(routeName, new { PageNumber = pageNumber, PageSize = pageSize });

            return new LinkInfo
            {
                Href = link,
                Rel = rel,
                Method = method
            };
        }
    }
}