using System;
using System.Collections;


namespace Back.Controllers
{
    struct pos
    {
        public int x;
        public int y;
    }
    struct noeud
    {
        public int[][] tab;
        public int x;
        public int y;
        public int score;
    }
    class IA
    {
        //parametre de l'IA
        private const int INFINI = 9999;

        public pos action { get; set; }

        public int x;
        public int y;

        private List<List<noeud>> noeuds;

        public IA()
        {
            noeuds = new List<List<noeud>>();
            x = 1;
            y = 1;
        }

        //alpha -infini
        //beta +infini
        public int alpha_beta(int[][] state, int alpha, int beta, bool isMaximising, int depth)
        {
            if (TerminalTest(state) || depth == 0) return Evaluate(state);

            //if( TerminalTest(state) || depth == 1 ){this.action.x = }

            List<noeud> l = new List<noeud>();

            if (isMaximising)
            {
                int maxEval = -INFINI;

                foreach (var child in successors(state, ref isMaximising))
                {
                    int eval = alpha_beta(child.tab, alpha, beta, false, depth - 1);
                    maxEval = Math.Max(maxEval, eval);
                    //determination de qui est maximum
                    alpha = Math.Max(alpha, eval);
                    //assignation de la valeur d'un noeud
                    noeud n;
                    n.x = child.x;
                    n.y = child.y;
                    n.tab = child.tab;
                    n.score = maxEval;
                    l.Add(n);
                    /////////////////////
                    ///

                    if (beta <= alpha)
                        break;
                }

                //Console.WriteLine("mety neny maximum");
                noeuds.Add(l);

                return maxEval;
            }
            else
            {
                int minEval = INFINI;
                foreach (var child in successors(state, ref isMaximising))
                {
                    int eval = alpha_beta(child.tab, alpha, beta, true, depth - 1);
                    minEval = Math.Min(minEval, eval);
                    //assignation de la valeur d'un noeud
                    noeud n;
                    n.x = child.x;
                    n.y = child.y;
                    n.tab = child.tab;
                    n.score = minEval;
                    l.Add(n);
                    /////////////////////
                    ///
                    //determination de qui est minimum
                    beta = Math.Min(beta, eval);
                    if (beta <= alpha)
                        break;
                }

                //Console.WriteLine("mety neny minimum");

                noeuds.Add(l);

                return minEval;
            }
        }

        public bool TerminalTest(int[][] state)
        {
            for (int i = 1; i < state.Length - 1; i++)
            {
                for (int j = 1; j < state[0].Length - 1; j++)
                {
                    if (state[i][j] == 0) return false;
                }
            }
            return true;
        }
        public List<noeud> successors(int[][] state, ref bool min)
        {
            List<noeud> list = new List<noeud>();
            int opponent = min ? 1 : 2;

            int[] dx = { -1, -1, -1, 0, 0, 1, 1, 1 };
            int[] dy = { -1, 0, 1, -1, 1, -1, 0, 1 };

            for (int i = 1; i < state.Length - 1; i++)
            {
                for (int j = 1; j < state[0].Length - 1; j++)
                {
                    if (state[i][j] == opponent)
                    {
                        for(int k = 0; k<8;k++)
                        {
                            int nx = i + dx[k];
                            int ny = j + dy[k];
                            if (nx >= 1 && ny >= 1 && nx < state.Length - 1 && ny < state[0].Length - 1 && state[nx][ny] == 0)
                            {
                                noeud n;
                                int[][] newState = (int[][])state.Clone();
                                newState[i][j] = min ? 2 : 1;
                                n.tab = newState;
                                n.x = nx;
                                n.y = ny;
                                n.score = 0;
                                list.Add(n);
                            }
                        }
                    }
                }
            }
            min = !min;
            return list;
        }

        public int Evaluate(int[][] state)
        {
            int maxPlayer = 2; // Le joueur maximisant (IA)
            int minPlayer = 1; // Le joueur minimisant (adversaire)
            int score = 0;

            for (int i = 1; i < state.Length - 1; i++)
            {
                for (int j = 1; j < state[0].Length - 1; j++)
                {
                    if (state[i][j] == maxPlayer)
                    {
                        // Points pour le joueur max
                        score += EvaluatePosition(i, j, state, maxPlayer, minPlayer);
                    }
                    else if (state[i][j] == minPlayer)
                    {
                        // Points le joueur min
                        score -= EvaluatePosition(i, j, state, minPlayer, maxPlayer);
                    }
                }
            }

            return score;
        }
        //erreur lors de l'arret de jeu c'est a dire lorseque l'arbre est fini

        private int EvaluatePosition(int x, int y, int[][] state, int player, int opponent)
        {
            int score = 0;

            // centre (éventuellement stratégique)
            int center = state.Length / 2;
            score += (center - Math.Abs(center - x)) + (center - Math.Abs(center - y));

            // les positions qui peuvent etre adjacentes
            int[] dx = { -1, 1, 0, 0, -1, 1, -1, 1 };
            int[] dy = { 0, 0, -1, 1, -1, -1, 1, 1 };
            for (int i = 0; i < 8; i++)
            {
                int nx = x + dx[i];
                int ny = y + dy[i];
                if (nx >= 1 && ny >= 1 && nx < state.Length - 1 && ny < state[0].Length - 1)
                {
                    if (state[nx][ny] == opponent)
                    {
                        score += 10;
                    }
                }
            }

            return score;
        }

        public void getnextMove(int[][] state, int alpha, int beta, bool isMaximising, int depth)
        {
            noeuds.Clear();
            int valeurFinal = this.alpha_beta(state, alpha, beta, isMaximising, depth);
            bool smax = false;
            int i = 0;
            Console.WriteLine(valeurFinal);
            foreach (var child in noeuds[0])
            {
                if (child.score == valeurFinal)
                {
                    x = child.x;
                    y = child.y;
                    smax = false; 
                    break;
                    //Console.WriteLine(" x : " + child.x + " | y : " + child.y );
                }
                smax = true;
                i++;
            }
            if(smax)
            {
                x = noeuds[0][i-1].x;
                y = noeuds[0][i - 1].y;
            }
        }
        /*
            exemple

                tab = new Int32[20,20];
                for(int i = 0;i<20;i++){
                    for(int j =0;i<20;i++){
                        tab[i,j] = 0;
                    }
                }
                tab[5,5] = 1;
                tab[5,4] = 2;
                tab[4,6] = 2;
                IA ia = new IA();
                Console.WriteLine(ia.alpha_beta(tab,-9999,9999,true,4));
        */

    }
}