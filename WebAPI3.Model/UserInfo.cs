using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Model
{
    
    public class UserInfo
    {
       // private List<Card> _cards=new List<Card>();       
        public int Id { get; set; }
        public string UserName { get; set; }
        public int Age { get; set; }
        public List<Card> Cards { get; set; }//{ set { _cards = value; } get { return _cards;} }
        public string SessionKey { get; set; }
        //public DateTime ExpiredTime { get; set; }
        //public DateTime CreateTime { get; set; }
        public string Status { get; set; }
        public DateTime AuditTime { get; set; }
        public string Auditer { get; set; }
        public void Auidt()
        {
                Status = "审核";
                AuditTime=DateTime.Now;
                Auditer = "auditer";
        }
        public string Password { get; set; }


    }
}
