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

        //private UserInfoItem userItem;// = new UserInfoItem();
        //public List<UserInfoItem> _items = new List<UserInfoItem>();
        //public List<UserInfoItem> Items { set; get; }
        //public void setItems(List<UserInfoItem> items) { this._items = items; }
        //public List<UserInfoItem> getItems() { return _items; }

        //public void setUserItem(UserInfoItem userItem) { this.userItem = userItem; }
        //public UserInfoItem getUserItem() { return userItem; }

        public string SessionKey { get; set; }
        //public DateTime ExpiredTime { get; set; }
        //public DateTime CreateTime { get; set; }

        public string Password { get; set; }
    }
}
