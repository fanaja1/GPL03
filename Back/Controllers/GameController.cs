using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        [HttpPut]
        public IActionResult ProcessData([FromBody] PlateauData data)
        {
            //return Ok(data.Plateau + " / " + data.DernierPoint.X + "  " + data.DernierPoint.Y);
            return Ok(data.Plateau + " / " + data.DernierPoint.X + "  " + data.DernierPoint.Y);
        }

        public class PlateauData
        {
            public string Plateau { get; set; }
            public Point DernierPoint { get; set; }
        }

        public class Point
        {
            public int X { get; set; }
            public int Y { get; set; }
        }
    }
}
