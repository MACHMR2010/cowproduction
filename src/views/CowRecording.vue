<template>
  <v-container fluid>
    <h1 style="margin-top: 50px">تسجيل البقر</h1>
    <v-row>
      <v-col cols="3" sm="3" md="3">
        <v-form ref="form" lazy-validation class="mt-15">
          <v-text-field v-model="cownumber" label="رقم البقرة" outlined dense required class="mx-12"></v-text-field>

          <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="cowdateinsc"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="cowdateinsc" label="تاريخ دخولها" readonly v-bind="attrs" v-on="on" class="mx-12"
                solo></v-text-field>
            </template>
            <v-date-picker v-model="cowdateinsc" no-title scrollable :min="this.mindate">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(cowdateinsc)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-select v-model="cowstrain" :items="selectstrain" label="سلالة" class="mx-12" item-value="text"></v-select>
          <v-btn color="success" class="mx-12" v-on:click="addOrUpdate">{{btnmessage}}</v-btn>

        </v-form>
      </v-col>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">رقم البقرة</th>
                <th class="text-left">تاريخ دخولها</th>
                <th class="text-left">سلالة</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cows" :key="item.name">
                <td>{{ item.idCow }}</td>
                <td>{{ item.iDate.substr(0, 10), }}</td>
                <td>{{ item.race }}</td>
                <td><v-btn v-on:click="updatecow(item._id, item.idCow, item.iDate, item.race)">تحديث</v-btn></td>
                <td><v-btn color="error" v-on:click="deletecow(item._id)">حذف</v-btn></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script >
import axios from "axios";
export default {
  data() {
    return {
      idtoupdate: null,
      btnmessage : "تسجيل",
      cownumber: null,
      cowdateinsc: null,
      cowstrain: null,
      selectstrain: [{ text: "الهولشتاين" }, { text: "املونتبليارد" }],
      cows: [],
      menu: false,
      mindate: new Date( Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
    };
  },


  methods: {

    updatecow(id, idCow, date, race) {
      this.idtoupdate = id;
      this.cownumber = idCow;
      this.cowdateinsc = date.substr(0, 10);
      this.cowstrain = race;
      this.btnmessage = "تحديث";

    },

    async deletecow(id) {
      console.log(id);
      await axios.delete("http://localhost:8085/cows/" + id).then((res) => {
        console.log(res);
        this.getAll();
      })
        .catch((err) => {
          console.log(err)
        });
    },

    async getAll() {
      await axios.get("http://localhost:8085/cows").then((res) => {
        console.log(res)
        this.cows = res.data;
      })
        .catch((err) => {
          console.log(err)
        });

    },
    addOrUpdate() {
      if (this.idtoupdate) {
        this.update();
      } else {
        this.add();
      }
    },
    async update() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        }
      }

      let data = {
        "idCow": this.cownumber,
        "iDate": this.cowdateinsc,
        "race": this.cowstrain
      }

      await axios.put("http://localhost:8085/cows/" + this.idtoupdate, data, config)
        .then((res) => {
          this.getAll();
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        });

        this.idtoupdate = null;
        this.btnmessage = "تسجيل";
    },
    async add() {

      console.log(this.cowstrain)

      let config = {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        }
      }

      let data = {
        "idCow": this.cownumber,
        "iDate": this.cowdateinsc,
        "race": this.cowstrain
      }

      await axios.post("http://localhost:8085/cows", data, config)
        .then((res) => {
          this.getAll();
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        });

    }
  },

  mounted() {
    this.getAll();
  },
};
</script>