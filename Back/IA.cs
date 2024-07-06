using System;
using System.Collections;
using devoir;

class IA
{
    //parametre de l'IA
    private const int INFINI = 9999;

    public pos action;

    private List<List<noeud>> noeuds;

    public IA()
    {
        noeuds = new List<List<noeud>>();
    }

    //alpha -infini
    //beta +infini
    public int alpha_beta(int[,] state,int alpha, int beta,bool isMaximising, int depth)
    {
        if(TerminalTest(state) || depth == 0) return Evaluate(state);

        List<noeud> l = new List<noeud>();

        if(isMaximising)
        {
            int maxEval = -INFINI;

            foreach(var child in successors(state,ref isMaximising))
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
            //Console.WriteLine(maxEval);

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
            //Console.WriteLine(minEval);

            return minEval;
        }
    }

    public bool TerminalTest(int[,] state){
        for(int i=0;i<state.GetLength(0);i++)
        {
            for(int j=0;j<state.GetLength(1);j++)
            {
                if(state[i,j] == 0) return false; 
            }
        }
        return true;
    }
    public List<noeud> successors(int[,] state,ref bool isMaximising)
    {
        List<noeud> list = new List<noeud>();
        int opponent = isMaximising ? 1 : 2;

        int[] dx = { -1, -1, -1, 0, 0, 1, 1, 1 };
        int[] dy = { -1, 0, 1, -1, 1, -1, 0, 1 };

        for(int i=0; i<state.GetLength(0);i++){
            for(int j=0;j<state.GetLength(1);j++){
                if (state[i, j] == opponent)
                {
                    for (int k = 0; k < 8; k++)
                    {
                        int nx = i + dx[k];
                        int ny = j + dy[k];
                        if (nx >= 0 && ny >= 0 && nx < state.GetLength(0) && ny < state.GetLength(1) && state[nx, ny] == 0)
                        {
                            int[,] newState = (int[,]) state.Clone();
                            newState[nx, ny] = isMaximising ? 2 : 1;

                            noeud n;
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
        return list;
    }

    public int Evaluate(int[,] state)
    {
        int maxPlayer = 2; // Le joueur maximisant (IA)
        int minPlayer = 1; // Le joueur minimisant (adversaire)
        int score = 0;
        
        for (int i = 0; i < state.GetLength(0); i++)
        {
            for (int j = 0; j < state.GetLength(1); j++)
            {
                if (state[i, j] == maxPlayer)
                {
                    // Points pour le joueur max
                    score += EvaluatePosition(i, j, state, maxPlayer, minPlayer);
                }
                else if (state[i, j] == minPlayer)
                {
                    // Points le joueur min
                    score -= EvaluatePosition(i, j, state, minPlayer, maxPlayer);
                }
            }
        }

        return score;
    }   
    //erreur lors de l'arret de jeu c'est a dire lorseque l'arbre est fini

    private int EvaluatePosition(int x, int y, int[,] state, int player, int opponent)
    {
        int score = 0;

        // centre (éventuellement stratégique)

        int center = state.GetLength(0) / 2;
        score += (center - Math.Abs(center - x)) + (center - Math.Abs(center - y));

        // les positions qui peuvent etre adjacentes
        int[] dx = { -1, 1, 0, 0, -1, 1, -1, 1 };
        int[] dy = { 0, 0, -1, 1, -1, -1, 1, 1 };
        for (int i = 0; i < 8; i++)
        {
            int nx = x + dx[i];
            int ny = y + dy[i];
            if (nx >= 0 && ny >= 0 && nx < state.GetLength(0) && ny < state.GetLength(1))
            {
                if (state[nx, ny] == opponent)
                {
                    score += 10;
                    if(nx > 0 && ny > 0 && nx < state.GetLength(0)-1 && ny < state.GetLength(1)-1)
                    {
                        if((state[nx+dx[0],ny+dy[0]] == player && state[nx+dx[2],ny+dy[2]] == player) 
                        || (state[nx+dx[1],ny+dy[1]] == player && state[nx+dx[3],ny+dy[3]] == player)
                        || (state[nx+dx[0],ny+dy[0]] == player && state[nx+dx[3],ny+dy[3]] == player)
                        || (state[nx+dx[2],ny+dy[2]] == player && state[nx+dx[3],ny+dy[3]] == player))
                        {
                            score+=10;
                        }
                        else if(((state[nx+dx[0],ny+dy[0]] == player && state[nx+dx[2],ny+dy[2]] == player) && (state[nx+dx[2],ny+dy[2]] == player && state[nx+dx[3],ny+dy[3]] == player) && (state[nx+dx[3],ny+dy[3]] == player && state[nx+dx[1],ny+dy[1]] == player)) 
                                || ((state[nx+dx[1],ny+dy[1]] == player && state[nx+dx[3],ny+dy[3]] == player) && (state[nx+dx[3],ny+dy[3]] == player && state[nx+dx[0],ny+dy[0]] == player) && (state[nx+dx[0],ny+dy[0]] == player && state[nx+dx[2],ny+dy[2]] == player))
                                || ((state[nx+dx[2],ny+dy[2]] == player && state[nx+dx[0],ny+dy[0]] == player) && (state[nx+dx[0],ny+dy[0]] == player && state[nx+dx[1],ny+dy[1]] == player) && (state[nx+dx[1],ny+dy[1]] == player && state[nx+dx[3],ny+dy[3]] == player))
                                || ((state[nx+dx[3],ny+dy[3]] == player && state[nx+dx[1],ny+dy[1]] == player) && (state[nx+dx[1],ny+dy[1]] == player && state[nx+dx[2],ny+dy[2]] == player) && (state[nx+dx[2],ny+dy[2]] == player && state[nx+dx[0],ny+dy[0]] == player)))
                        {
                            score += 50;
                            Console.WriteLine("eto no antoniny");
                        }else if((state[nx+dx[0],ny+dy[0]] == player && state[nx+dx[2],ny+dy[2]] == player) 
                                && (state[nx+dx[1],ny+dy[1]] == player && state[nx+dx[3],ny+dy[3]] == player)
                                && (state[nx+dx[0],ny+dy[0]] == player && state[nx+dx[3],ny+dy[3]] == player)
                                && (state[nx+dx[2],ny+dy[2]] == player && state[nx+dx[3],ny+dy[3]] == player))
                        {
                            score += 100;
                            Console.WriteLine("eto ny betsaka indrindra");
                        }
                        else
                        {
                            score += 20;
                        }
                    }
                }
                
            }
        }

        return score;
    }

    public void getnextMove(int[,] state,int alpha, int beta,bool isMaximising, int depth)
    {
        noeuds.Clear();
        int valeurFinal = this.alpha_beta(state,alpha,beta,isMaximising,depth);
        bool smax = false;
        int i = 0;
        Console.WriteLine(valeurFinal);
        foreach(var child in noeuds[0])
        {
            if(child.score == valeurFinal)
            {
                action.x = child.x;
                action.y = child.y;
                Console.WriteLine(" x : " + child.x + " | y : " + child.y );
                Console.WriteLine(child.score);
                smax = false;
                break;
            }
            smax = true;
            i++;
            Console.WriteLine("eto le score " + child.score);
        }
        if(smax)
        {
            //if(state[noeuds[0][i-1].x,noeuds[0][i-1].y] != 0)
            action.x = noeuds[0][i-1].x;
            action.y = noeuds[0][i-1].y;
        }
        Console.WriteLine(" x : " + action.x + " | y : " + action.y );

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