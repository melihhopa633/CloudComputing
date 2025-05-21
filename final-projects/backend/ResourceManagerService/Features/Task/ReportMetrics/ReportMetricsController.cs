using Microsoft.AspNetCore.Mvc;
using MediatR;
using System;
using System.Threading.Tasks;

namespace ResourceManagerService.Features.Task.ReportMetrics
{
    [ApiController]
    [Route("api/report-metrics")]
    public class ReportMetricsController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ReportMetricsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("{id:guid}")]
        public async Task<IActionResult> Report(Guid id)
        {
            var result = await _mediator.Send(new ReportMetricsCommand(id));
            if (result)
                return Ok(new { success = true, message = "Task metrics reported to blockchain (controller)" });
            else
                return NotFound(new { success = false, message = "Task not found" });
        }
    }
} 