using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI3.Model
{
    public class Card
    {
        public int Id { get; set; }
        public string CardName { get; set; }
        public decimal CardPrice { get; set; }
        public UserInfo User { get; set; } //public int UserId { get; set; }  已包含在User对象中作为主表存在

    }
}
