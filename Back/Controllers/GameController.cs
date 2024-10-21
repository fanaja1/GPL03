using Microsoft.AspNetCore.Mvc;
using System.Text;

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
            public override string ToString()
            {
                return $"({X}, {Y})";
            }
        }

        public class DebugClass
        {
            public bool palindrome { get; set; }
            public bool validation { get; set; }
            public bool sValidation { get; set; }
            public List<Point> circuit { get; set; }

            public List<string> log { get; set; } = new List<string>();
            public List<string> log2 { get; set; } = new List<string>();

            public List<List<Point>> xyList { get; set; } = new List<List<Point>>();

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

        int totalPlayer;
        int currentPlayer = 1;
        int debX, debY;
        int[][] grid;
        int numRows, countScore, tempScore, numCols;
        List<List<List<Point>>> circuitList;
        List<Point> xyList;

        ResponseIA res = new ResponseIA();

        bool secondValidation = false;

        public class ResponseData
        {
            public List<List<List<Point>>> CircuitList { get; set; }  // joueur<n<circuit<point>>>
            public int currentPlayer { get; set; }
            public int[][] plateau { get; set; }

            //Debugging***********************************/
            public DebugClass debug { get; set; }
            public int score { get; internal set; }
        }

        [HttpPut]
        [Route("IA")]
        public IActionResult ProcesData([FromBody] PlateauData data)
        {
            IA ia = new IA();
            ia.getnextMove(data.Plateau,-99999, 99999,false,4);

            // // Structurer la réponse
            var response = new ResponseData
            {
                currentPlayer = ia.x,
                score = ia.y
            };

            res.x = ia.x;
            res.y = ia.y;
            return Ok(response);
        }

        public class ResponseIA
        {
            public int x;
            public int y;
        }

        [HttpPut]
        [Route("ProcessData")]
        public IActionResult ProcessData([FromBody] PlateauData data)
        {
            totalPlayer = data.CircuitList.Count;
            currentPlayer = data.currentPlayer;
            xyList = new List<Point>();

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

            // Initialisation et copie de la liste de circuits
            circuitList = new List<List<List<Point>>>();
            foreach (var outerList in data.CircuitList)
            {
                var innerListContainer = new List<List<Point>>();
                foreach (var innerList in outerList)
                {
                    var pointList = new List<Point>();
                    foreach (var point in innerList)
                    {
                        pointList.Add(new Point { X = point.X, Y = point.Y });
                    }
                    innerListContainer.Add(pointList);
                }
                circuitList.Add(innerListContainer);
            }

            //points.Add(GenerateRandomPointsList(5));
            //points.Add(GenerateRandomPointsList(5));

            debX = data.DernierPoint.X;
            debY = data.DernierPoint.Y;
            numRows = data.Plateau.Length;
            numCols = data.Plateau[0].Length;

            debugClass = new DebugClass();

            bool status = BuildUpCircuit(data.DernierPoint.X, data.DernierPoint.Y, xyList , circuitList, 0, 0);

            if (!status || tempScore == 0)
            {
                currentPlayer = currentPlayer % totalPlayer + 1;
            }

            // // Structurer la réponse
            var response = new ResponseData
            {
                CircuitList = circuitList,
                plateau = grid,
                currentPlayer = currentPlayer,
                score = tempScore,
                debug = debugClass
            };

            tempScore = 0;
            xyList.Clear();

            return Ok(response);
        }

        private bool BuildUpCircuit(int x, int y, List<Point> xyList, List<List<List<Point>>> circuitList, int apart, int counter)
        {
            bool buildedUp = false;

            xyList.Add(new Point { X = x, Y = y }); // à l'indice counter

            debugClass.log.Add("1- counter:" + counter + " apart:" + apart + " list:" + ConvertListToString(CopyCircuit(xyList)));

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
                            xyList.Add(new Point { X = x + j, Y = y + i }); // à l'indice counter + 1

                            // Fermer le circuit en ajoutant une copie des coordonnées de xyList à circuitList
                            List<Point> xyListCopy = CopyCircuit(xyList);

                            bool validation = ValidateCircuit(xyListCopy, circuitList);

                            debugClass.validation = validation;
                            debugClass.sValidation = secondValidation;
                            debugClass.circuit = CopyCircuit(xyList);

                            // Réinitialiser la seconde validation
                            secondValidation = false;

                            xyList.RemoveRange(counter, xyList.Count - counter);

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
            
            debugClass.log.Add("2- counter:" + counter + " list:" + ConvertListToString(CopyCircuit(xyList)));


            xyList.RemoveAt(xyList.Count - 1);
            return buildedUp;
        }

        public static string ConvertListToString(List<Point> points)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("[");

            for (int i = 0; i < points.Count; i++)
            {
                sb.Append(points[i].ToString());
                if (i < points.Count - 1)
                {
                    sb.Append(", ");
                }
            }

            sb.Append("]");
            return sb.ToString();
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
                    if (x == xyList[i].X &&
                        y == xyList[i].Y)
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

        //point adve tratra anaty circuit
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
            int tempPlayer = ((gridCopy[y][x] - 1) % (totalPlayer + 1)) + 1;//s/ 2
            //int other = tempPlayer == 1 ? 2 : 1;

            int[] other = new int[totalPlayer - 1]; //s/ 1 ??-3-4

            // Remplir le tableau avec des valeurs 1, 3, et 4
            int index = 0;
            for (int i = 1; i <= totalPlayer; i++)
            {
                if (i != tempPlayer)
                {
                    other[index++] = i;
                }
            }

            for (int j = x - 1; j > beginX; j--)
            {
                int currentJ = (gridCopy[y][j] - 1) % (totalPlayer + 1);//s/ 0 (grid rouge)
                int indexOfThree = Array.FindIndex(other, element => element == (currentJ + 1));
                if (indexOfThree != -1)
                {
                    foreach (var c in circuitList[other[indexOfThree] - 1])
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

                for (int x = ((circuit[i].X) + 1); x < (numCols - 1); x++)
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
                    if (x == numCols - 2)
                    {
                        check = false;
                        debugClass.tab[debugClass.tab.Count - 1].Add(check);
                    }
                }


                if (check && !(beginX == previousX && y == previousY))
                {
                    // mijery ze point adve tratra
                    for (int x = beginX + 1; x < endX; x++)
                    {
                        if (gridCopy[y][x] != currentPlayer && IsCaught(x, y, circuit))
                        {

                            if (gridCopy[y][x] > (totalPlayer + 1))
                            {
                                bool caught = IsCaughtByNonSubCircuit(gridCopy, beginX, x, y);

                                debugClass.caugth = caught;
                                debugClass.tongaEto = true;

                                if (!caught)
                                {
                                    return false;
                                }
                            }
                            if (gridCopy[y][x] < (totalPlayer + 1))
                            {
                                if (gridCopy[y][x] != 0)
                                {
                                    countScore++;
                                }
                                secondValidation = true;
                                gridCopy[y][x] += (totalPlayer  + 1);
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
