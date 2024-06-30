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
        //private List<Point> GenerateRandomPointsList(int count)
        //{
        //    Random random = new Random();
        //    List<Point> points = new List<Point>();

        //    for (int i = 0; i < count; i++)
        //    {
        //        // Générer des coordonnées aléatoires entre 0 et 100 (par exemple)
        //        int x = random.Next(0, 100);
        //        int y = random.Next(0, 100);
        //        points.Add(new Point { X = x, Y = y });
        //    }

        //    return points;
        //}


        public class Point
        {
            public int X { get; set; }
            public int Y { get; set; }
        }


        public class DebugClass
        {
            public bool palindrome { get; set; }
            public bool validation { get; set; }
            public bool sValidation { get; set; }
            public List<Point> circuit { get; set; }
            public bool caugth { get; set; }
            public bool catchOpponent_firstV { get; internal set; }
            public bool tongaEto { get; internal set; }
            public List<List<bool>> tab { get; set; } = new List<List<bool>>();
        }

        public DebugClass debugClass;

        public class PlateauData
        {
            public List<List<List<Point>>> CircuitList { get; set; }
            public int[][] Plateau { get; set; }
            public Point DernierPoint { get; set; }
            public int currentPlayer { get; set; }
        }


        int totalPlayer = 2;
        int currentPlayer = 1;
        int debX, debY;
        int[][] grid;
        int numRows, countScore, tempScore;
        List<List<List<Point>>> circuitList;
        List<List<Point>> xyList = new List<List<Point>>();

        bool secondValidation = false;


        public class ResponseData
        {
            public List<List<List<Point>>> CircuitList { get; set; }  // joueur<n<circuit<point>>>
            public int currentPlayer { get; set; }

            //Debugging***********************************/
            //public DebugClass debug { get; set; }
            //public int[][] plateau { get; set; }
        }

        [HttpPut]
        [Route("ProcessData")]
        public IActionResult ProcessData([FromBody] PlateauData data)
        {
            currentPlayer = data.currentPlayer;
            for (int i = 0; i < totalPlayer; i++)
            {
                xyList.Add(new List<Point>());
            }

            grid = new int[data.Plateau.Length][];
            for (int i = 0; i < grid.Length; i++)
            {
                grid[i] = new int[data.Plateau[i].Length];
            }

            for (int i = 0; i < data.Plateau.Length; i++)
            {
                for (int j = 0; j < data.Plateau[i].Length; j++)
                {
                    grid[i][j] = data.Plateau[i][j];
                }
            }

            //grid = data.Plateau;

            circuitList = new List<List<List<Point>>>();
            for (int i = 0; i < totalPlayer; i++)
            {
                circuitList.Add(new List<List<Point>>());
            }

            //points.Add(GenerateRandomPointsList(5));
            //points.Add(GenerateRandomPointsList(5));

            debX = data.DernierPoint.X;
            debY = data.DernierPoint.Y;
            numRows = data.Plateau[0].Length;

            debugClass = new DebugClass();

            bool status = BuildUpCircuit(data.DernierPoint.X, data.DernierPoint.Y, xyList , circuitList, 0, 0);

            if (!status || tempScore == 0)
            {
            }
            currentPlayer = currentPlayer == 1 ? 2 : 1;

            tempScore = 0;
            xyList.Clear();

            // // Structurer la réponse
            var response = new ResponseData
            {
                CircuitList = circuitList,
                //CircuitList = data.CircuitList,
                currentPlayer = currentPlayer,
                //debug = debugClass
            };

            return Ok(response);
        }

        private bool BuildUpCircuit(int x, int y, List<List<Point>> xyList, List<List<List<Point>>> circuitList, int apart, int counter)
        {
            bool buildedUp = false;


            xyList[currentPlayer - 1].Add(new Point { X = x, Y = y }); // à l'indice counter

            for (int i = -1; i <= 1; i++)
            {
                for (int j = -1; j <= 1; j++)
                {
                    bool u = Unlike(j, i, apart);
                    bool r = Reliable(x + j, y + i, counter - 1);

                    if (u && r)
                    {
                        if (x + j == debX && y + i == debY)
                        {
                            xyList[currentPlayer - 1].Add(new Point { X = x + j, Y = y + i }); // à l'indice counter + 1

                            // Fermer le circuit en ajoutant une copie des coordonnées de xyList à circuitList
                            List<Point> xyListCopy = CopyCircuit(xyList[currentPlayer - 1]);

                            bool validation = ValidateCircuit(xyListCopy, circuitList);

                            debugClass.validation = validation;
                            debugClass.sValidation = secondValidation;
                            debugClass.circuit = CopyCircuit(xyList[currentPlayer - 1]);

                            // Réinitialiser la seconde validation
                            secondValidation = false;

                            xyList[currentPlayer - 1].RemoveAt(counter);

                            return validation;
                        }
                        else
                        {
                            int _apart = (j == -1 && i == -1) ? 1 :
                                         (j == 0 && i == -1) ? 2 :
                                         (j == 1 && i == -1) ? 3 :
                                         (j == -1 && i == 0) ? 4 :
                                         (j == 1 && i == 0) ? 6 :
                                         (j == -1 && i == 1) ? 7 :
                                         (j == 0 && i == 1) ? 8 :
                                         (j == 1 && i == 1) ? 9 : apart;

                            bool recursiveBuildUp = BuildUpCircuit(x + j, y + i, xyList, circuitList, _apart, counter + 1);

                            if (recursiveBuildUp)
                            {
                                buildedUp = true;
                            }
                        }
                    }
                }
            }

            xyList[currentPlayer - 1].RemoveAt(xyList[currentPlayer - 1].Count - 1);
            return buildedUp;
        }


        private bool Unlike(int i, int j, int apart)
        {
            if (i == 0 && j == 0)
            {
                return false;
            }

            switch (apart)
            {
                /*   i
                   j 1-2-3
                     4-*-6
                     7-8-9 */
                case 1:
                    // bd-d-b
                    return (i == 1 && j == 1) || (i == 1 && j == 0) || (i == 0 && j == 1)
                        ? false
                        : true;
                case 2:
                    // b-g-d-bg-bd
                    return (i == 0 && j == 1) ||
                           (i == -1 && j == 0) ||
                           (i == 1 && j == 0) ||
                           (i == -1 && j == 1) ||
                           (i == 1 && j == 1)
                        ? false
                        : true;
                case 3:
                    // bg-g-b
                    return (i == -1 && j == 1) || (i == -1 && j == 0) || (i == 0 && j == 1)
                        ? false
                        : true;
                case 4:
                    // d-h-b-hd-bd
                    return (i == 1 && j == 0) ||
                           (i == 0 && j == -1) ||
                           (i == 0 && j == 1) ||
                           (i == 1 && j == -1) ||
                           (i == 1 && j == 1)
                        ? false
                        : true;
                case 6:
                    // g-h-b-hg-bg
                    return (i == -1 && j == 0) ||
                           (i == 0 && j == -1) ||
                           (i == 0 && j == 1) ||
                           (i == -1 && j == -1) ||
                           (i == -1 && j == 1)
                        ? false
                        : true;
                case 7:
                    // hd-h-d
                    return (i == 1 && j == -1) || (i == 0 && j == -1) || (i == 1 && j == 0)
                        ? false
                        : true;
                case 8:
                    // h-g-d-hg-hd
                    return (i == 0 && j == -1) ||
                           (i == -1 && j == 0) ||
                           (i == 1 && j == 0) ||
                           (i == -1 && j == -1) ||
                           (i == 1 && j == -1)
                        ? false
                        : true;
                case 9:
                    // hg-g-h
                    return (i == -1 && j == -1) ||
                           (i == -1 && j == 0) ||
                           (i == 0 && j == -1)
                        ? false
                        : true;
                default:
                    return true;
            }
        }

        private bool Reliable(int x, int y, int leng)
        {
            if (grid[y][x] == currentPlayer)
            {
                for (int i = leng; i > 0; i--)
                {
                    if (x == xyList[currentPlayer - 1][i].X &&
                        y == xyList[currentPlayer - 1][i].Y)
                    {
                        return false;
                    }
                }
                return true;
            }
            else
            {
                return false;
            }
        }

        private List<Point> CopyCircuit(List<Point> circuit)
        {
            List<Point> circuitCopy = new List<Point>();

            foreach (var point in circuit)
            {
                circuitCopy.Add(new Point { X = point.X, Y = point.Y });
                
            }

            return circuitCopy;
        }

        private bool IsInCircuit(int x, int y, List<Point> _circuit)
        {
            foreach (var coords in _circuit)
            {
                if (coords.X == x && coords.Y == y)
                {
                    return true;
                }
            }
            return false;
        }

        private bool IsCaught(int x, int y, List<Point> circuit)
        {
            bool temp = false;

            for (int j = y + 1; j < numRows - 1; j++)
            {
                if (IsInCircuit(x, j, circuit))
                {
                    temp = true;
                    break;
                }
                temp = false;
            }

            if (temp)
            {
                for (int j = y - 1; j >= 0; j--)
                {
                    if (IsInCircuit(x, j, circuit))
                    {
                        temp = true;
                        break;
                    }
                    temp = false;
                }
            }

            return temp;
        }

        private bool IsPalindrome(List<Point> c1, List<Point> c2)
        {
            int n = c1.Count;
            if (n != c2.Count)
            {
                return false;
            }

            for (int i = 0; i < (n / 2); i++)
            {
                if (c1[i].X != c2[n - 1 - i].X || c1[i].Y != c2[n - 1 - i].Y)
                {
                    return false;
                }
            }

            return true;
        }

        private bool IsCaughtByNonSubCircuit(int[][] gridCopy, int beginX, int x, int y)
        {
            bool outValue = false;
            int tempPlayer = ((gridCopy[y][x] - 1) % 3) + 1;
            int other = tempPlayer == 1 ? 2 : 1;

            for (int j = x - 1; j > beginX; j--)
            {
                int currentJ = (gridCopy[y][j] - 1) % 3;
                if (currentJ == other - 1)
                {
                    foreach (var c in circuitList[other - 1])
                    {
                        if (IsInCircuit(j, y, c))
                        {
                            outValue = true;
                            break;
                        }
                    }
                    if (outValue)
                    {
                        break;
                    }
                }
            }

            return outValue;
        }

        private bool CatchOpponent(List<Point> circuit)
        {

            countScore = 0;
            int previousX = -1;
            int previousY = -1;

            // Créer une copie de la grille (copie profonde)
            int[][] gridCopy = new int[grid.Length][];
            for (int i = 0; i < grid.Length; i++)
            {
                gridCopy[i] = new int[grid[i].Length];
                //Array.Copy(grid[i], gridCopy[i], grid[i].Length);
            }

            for (int i = 0; i < grid.Length; i++)
            {
                for (int j = 0; j < grid[i].Length; j++)
                {
                    gridCopy[i][j] = grid[i][j];
                }
            }

            debugClass.tab.Add(new List<bool>());

            // Recherche de gauche à doite à partir de chaque point du circuit
            for (int i = 0; i < circuit.Count - 1; i++)
            {
                int y = circuit[i].Y;
                bool check = false;
                int beginX = circuit[i].X;
                int endX = 0;

                for (int x = ((circuit[i].X) + 1); x < (numRows - 1); x++)
                {
                    if (!check && IsInCircuit(x, y, circuit))
                    {
                        beginX = x;
                        continue;
                    }
                    check = true;
                    if (check && IsInCircuit(x, y, circuit))
                    {
                        endX = x;
                        break;
                    }
                    if (x == numRows - 2)
                    {
                        check = false;
                        debugClass.tab[debugClass.tab.Count - 1].Add(check);
                    }
                }

                debugClass.tongaEto = true;

                if (check && !(beginX == previousX && y == previousY))
                {
                    for (int x = beginX + 1; x < endX; x++)
                    {
                        if (gridCopy[y][x] != currentPlayer && IsCaught(x, y, circuit))
                        {
                            if (gridCopy[y][x] > 3)
                            {
                                bool caught = IsCaughtByNonSubCircuit(gridCopy, beginX, x, y);

                                debugClass.caugth = caught;

                                if (!caught)
                                {
                                    return false;
                                }
                            }
                            if (gridCopy[y][x] < 3)
                            {
                                if (gridCopy[y][x] != 0)
                                {
                                    countScore++;
                                }
                                secondValidation = true;
                                gridCopy[y][x] += 3;
                            }
                        }
                    }
                }

                previousX = beginX;
                previousY = y;
            }

            for (int i = 0; i < grid.Length; i++)
            {
                for (int j = 0; j < grid[i].Length; j++)
                {
                    grid[i][j] = gridCopy[i][j];
                }
            }

            return true;
        }

        private bool ValidateCircuit(List<Point> circuit, List<List<List<Point>>> circuitList)
        {
            for (int i = circuitList[currentPlayer - 1].Count - 1; i >= 0; i--)
            {
                bool palindromeCheck = IsPalindrome(circuit, circuitList[currentPlayer - 1][i]);

                debugClass.palindrome = palindromeCheck;

                if (palindromeCheck)
                {
                    return false;
                }
            }

            bool firstValidation = CatchOpponent(circuit);

            debugClass.catchOpponent_firstV = firstValidation;

            if (firstValidation && secondValidation)
            {
                circuitList[currentPlayer - 1].Add(circuit);
                tempScore += countScore;
            }

            return firstValidation && secondValidation;
        }

        
    }
}
