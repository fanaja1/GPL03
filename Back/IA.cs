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

        //if( TerminalTest(state) || depth == 1 ){this.action.x = }

        if(isMaximising)
        {
            int maxEval = -INFINI;
            List<noeud> l = successors(state,ref isMaximising);
            foreach(var child in successors(state,ref isMaximising))
            {
                int eval = alpha_beta(child.tab, alpha, beta, false, depth - 1);
                maxEval = Math.Max(maxEval, eval);
                //assignation de la valeur d'un noeud
                //determination de qui est maximum
                alpha = Math.Max(alpha, eval);
                if (beta <= alpha)
                    break;
            }
            return maxEval;
        }
        else
        {
            int minEval = INFINI;
            foreach (var child in successors(state, ref isMaximising))
            {
                int eval = alpha_beta(child.tab, alpha, beta, true, depth - 1);
                minEval = Math.Min(minEval, eval);
                //determination de qui est minimum
                beta = Math.Min(beta, eval);
                if (beta <= alpha)
                    break;
            }
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
    public List<noeud> successors(int[,] state,ref bool min)
    {
        List<noeud> list = new List<noeud>();
        bool end = false;
        for(int i=0; i<state.GetLength(0);i++){
            for(int j=0;j<state.GetLength(1);j++){
                if(state[i,j] == 0)
                {
                    noeud n;
                    int[,] newState = (int[,]) state.Clone();
                    newState[i,j] = min ? 2 : 1;
                    n.tab = newState;
                    n.x = i;
                    n.y = j;
                    n.score = 0;
                    end = true;
                    list.Add(n);
                    break;
                }
            }
            if(end) break;
        }
        min = !min;
        return list;
    }

    public int Evaluate(int[,] state)
    {
        int maxPlayer = 1; // Le joueur maximisant (IA)
        int minPlayer = 2; // Le joueur minimisant (adversaire)
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
                }
            }
        }

        return score;
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