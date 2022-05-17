import {Button} from "@mui/material";
import axios from "axios";
import {userApi} from "./api";

const users = [
  {
    username: "Irene",
    phone_number: "+2349035793260",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://1.bp.blogspot.com/-NiNaLUVIuaE/XdP7uYpCD_I/AAAAAAAAbu8/j1n9UFpof_QqchUqFqJO2ZNcu6wRToLpwCLcBGAsYHQ/s16000-rw/24%2BHearts%2BDP%2BProfile%2BPictures%2Bcollection%2B2019%2B-facebookdp%2B%252817%2529.jpg",
  },
  {
    username: "Jacobs Will",
    phone_number: "+2349035793261",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://cdn.statusqueen.com/dpimages/thumbnail/dp_images_8-1279.jpg",
  },
  {
    username: "Bradd Corks",
    phone_number: "+2349035793262",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://1.bp.blogspot.com/-TT_x8v5m3oc/YRPrUj7s9nI/AAAAAAAAF58/Fz059AwmjA4qT5jeuv3dtgFlhi3MbKD9ACLcBGAsYHQ/s666/8d41037b31cc73726885d256a3f99757.jpg",
  },
  {
    username: "Stephen Hawkings",
    phone_number: "+2349035793263",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://c1.thejournal.ie/media/2013/04/stephen-2-752x501.jpg",
  },
  {
    username: "Albert Einstein",
    phone_number: "+2349035793264",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://parade.com/wp-content/uploads/2021/08/albert-einstein-quotes.jpg",
  },
  {
    username: "Annabela",
    phone_number: "+2349035793265",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://media.funalive.com/article/images/pretty_girls_is_why_were_all_here_640_01.jpg",
  },
  {
    username: "Missy Tina",
    phone_number: "+2349035793266",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://p.favim.com/orig/2018/11/19/cute-cute-girls-pretty-Favim.com-6586065.jpg",
  },
  {
    username: "Paul Ronald",
    phone_number: "+2349035793267",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://www.whatsappimages.in/wp-content/uploads/2021/12/Free-Stylish-Boys-Whatsapp-DP-Wallpaper-for-Status.jpg",
  },
  {
    username: "Boluwatife",
    phone_number: "+2349035793268",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://alexis.lindaikejisblog.com/photos/shares/614681e2634aa.jpg",
  },
  {
    username: "Olami Dipupo",
    phone_number: "+2349035793210",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://www.unigreet.com/wp-content/uploads/2020/09/cartoon-dp-for-whatsapp-832x1024.jpg",
  },
  {
    username: "Ogochukwu",
    phone_number: "+2349035793211",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "http://www.goodmorningimagesdownload.com/wp-content/uploads/2021/02/Hd-Cute-Cartoon-Dp-Pics-Photo.jpg",
  },
  {
    username: "Chris Precious",
    phone_number: "+2349035793212",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo: "https://wallpaperaccess.com/full/4588325.jpg",
  },
  {
    username: "Ada Cynthia",
    phone_number: "+2349035793213",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://static.turbosquid.com/Preview/2015/09/04__17_26_23/girl01.jpga6e02d03-df13-4f39-a0b6-a16c815063e2Large.jpg",
  },
  {
    username: "Mariam Temidayo",
    phone_number: "+2349035793214",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://i.pinimg.com/originals/a2/e8/e6/a2e8e6990e950381a8c167a5e91054be.jpg",
  },
  {
    username: "Tomi Tomike",
    phone_number: "+2349035793215",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://cdna.artstation.com/p/assets/images/images/021/658/830/large/sydney-mg-beatz-muthaphuli-beautiful-afro-girl-cartoon-illustration-by-muthaphuli-sydney-1-from-thohoyandou.jpg?1572479311",
  },
  {
    username: "Ayomide",
    phone_number: "+2349035793216",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo: "https://wallpaperaccess.com/full/2099727.jpg",
  },
  {
    username: "Harry",
    phone_number: "+2349035793217",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo: "https://wallpapercave.com/wp/wp10178866.jpg",
  },
  {
    username: "Jack & Jill",
    phone_number: "+2349035793218",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://i.pinimg.com/736x/b0/cc/30/b0cc30779f507b865bff8e89a2e5202a.jpg",
  },
  {
    username: "Yemi Foluke ",
    phone_number: "+2349035793219",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo: "https://wallpaperaccess.com/full/4692034.jpg",
  },
  {
    username: "Zack",
    phone_number: "+2349035793220",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-3-scaled.jpg",
  },
  {
    username: "Christopher",
    phone_number: "+2349035793221",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://www.imagediamond.com/blog/wp-content/uploads/2020/06/cartoon-boy-images-2.jpg",
  },
  {
    username: "Victory",
    phone_number: "+2349035793222",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo: "",
  },
  {
    username: "Princess Anna",
    phone_number: "+2349035793223",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo: "https://www.bcmud.org/images/princess.jpg",
  },
  {
    username: "Xavier",
    phone_number: "+2349035793224",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://i.pinimg.com/736x/e8/91/57/e891575d03afba348fa6242e41610215.jpg",
  },
  {
    username: "Xayden",
    phone_number: "+2349035793225",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://funkylife.in/wp-content/uploads/2021/07/whatsapp-dp-52.jpg",
  },
  {
    username: "Uriel",
    phone_number: "+2349035793226",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://i.pinimg.com/originals/7c/d2/a8/7cd2a8a240c7d851a24d3a2d2db97c3f.jpg",
  },
  {
    username: "Zion",
    phone_number: "+2349035793227",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo: "",
  },
  {
    username: "Walters",
    phone_number: "+2349035793228",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo: "",
  },
  {
    username: "Wesley Weston",
    phone_number: "+2349035793229",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "https://helostatus.com/wp-content/uploads/2021/08/profile-pictures-for-WhatsApp-768x768.jpg",
  },
  {
    username: "Yosef",
    phone_number: "+2349035793230",
    password: "12345678",
    confirm_password: "12345678",
    profile_photo:
      "http://www.goodmorningimagesdownload.com/wp-content/uploads/2021/02/Hd-Cute-Cartoon-Dp-Free-Pics.jpg",
  },
];

const CreateUsers = () => {
  const handleCreateUsers = () => {
    users.map(user => {
      axios
        .post(`${userApi}/signup`, user)
        .then(user => {
          console.log(user._id);
        })
        .catch(error => {
          console.log(error.response);
        });
    });
    console.log(users);
  };

  return <Button onClick={handleCreateUsers}>Create Users</Button>;
};

export default CreateUsers;
