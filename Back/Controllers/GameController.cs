using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        [HttpPut]
        [Route("ProcessData")]
        public IActionResult ProcessData([FromBody] Point data)
        {

            //return Ok(data.Plateau + " / " + data.DernierPoint.X + "  " + data.DernierPoint.Y);
            return Ok($"Données reçues : {data.X} - {data.Y}");//.Plateau + " / " + data.DernierPoint.X + "  " + data.DernierPoint.Y);
        }

        [HttpPut]
        [Route("ProcessMat")]
        public IActionResult ProcessMat([FromBody] int[][] data)
        {
            // Traitement de la matrice plateau
            // Par exemple :
            Console.WriteLine("Matrice reçue : ");
            foreach (var row in data)
            {
                Console.WriteLine(string.Join(", ", row));
            }

            return Ok(data);
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
