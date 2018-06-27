using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Model
{
    
    public class UserInfo
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public int Age { get; set; }
        public List<Card> Cards { set; get; }
        public string SessionKey { get; set; }
        //public DateTime ExpiredTime { get; set; }
        //public DateTime CreateTime { get; set; }

        public string Password { get; set; }
    }
}
