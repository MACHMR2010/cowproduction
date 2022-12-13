<template>
  <v-container fluid>
    <v-spacer></v-spacer>
    <h1 style="margin-top: 50px">تسجيل الوالدات</h1>
    <v-row>
      <v-col cols="3" sm="3" md="3">
        <v-form ref="form" lazy-validation class="mt-15">
          <v-select 
          v-model="cowmothernumber" 
          :items="cows" 
          label="رقم البقرة الام" 
          class="mx-12" 
          item-value="idCow"
          item-text="idCow"
          return-object
          single-line
          outlined dense required>
          </v-select>


          <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="datebirth"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="datebirth" label="تاريخ الولادة" readonly v-bind="attrs" v-on="on" class="mx-12"
                solo></v-text-field>
            </template>
            <v-date-picker v-model="datebirth" no-title scrollable :min="this.mindate">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(datebirth)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-btn color="success" class="mx-12" v-on:click="addOrUpdate">{{btnmessage}}</v-btn>

        </v-form>
      </v-col>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">رقم البقرة</th>
                <th class="text-left">رقم البقرة الام</th>
                <th class="text-left">تاريخ الولادة</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in births" :key="item.name">
                <td>{{ item.idBirth }}</td>
                <td>{{ item.idCowMother }}</td>
                <td>{{ item.birthDate.substr(0, 10), }}</td>
                <td><v-btn v-on:click="updatecow(item._id, item.idCowMother, item.birthDate)">تحديث</v-btn></td>
                <td><v-btn color="error" v-on:click="deletecow(item._id)">حذف</v-btn></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar">
      OK

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>


<script >
import axios from "axios";
export default {
  data() {
    return {
      cowmothernumber: null,
      datebirth: null,
      btnmessage : "تسجيل",
      snackbar: false,
      idtoupdate:null,
      births: [],
      cows:[],
      menu: false,
      mindate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
    };
  },

  mounted(){
    this.getAll();
  },

  methods: {

    addOrUpdate() {
      if (this.idtoupdate) {
        this.update();
      } else {
        this.add();
      }
    },

    updatecow(id, idCow, date) {
      this.idtoupdate = id;
      this.cowmothernumber = idCow;
      this.datebirth = date.substr(0, 10);
      this.btnmessage = "تحديث"
    },

    async update() {
      let config = {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        }
      }

      let data = {
        "idCowMother": this.cowmothernumber.idCow,
        "birthDate": this.datebirth,
      }

      await axios.put("http://localhost:8085/births/" + this.idtoupdate, data, config)
        .then((res) => {
          this.getAll();
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        });

        this.idtoupdate = null;
        this.btnmessage = "تسجيل"
    },

    async getAllRaces(){
      await axios.get("http://localhost:8085/cows").then((res) => {
        console.log(res)
        this.cows = res.data;
      })
        .catch((err) => {
          console.log(err)
        });
    },

    async deletecow(id){
      console.log(id);
      await axios.delete("http://localhost:8085/births/" + id).then((res) => {
          console.log(res);
          this.getAll();
        })
        .catch((err) => {
          console.log(err)
        });
    },

    async getAll() {
       await axios.get("http://localhost:8085/births").then((res) => {
          console.log(res)
          this.births = res.data;
          this.getAllRaces();
        })
        .catch((err) => {
          console.log(err)
        });

    },

    async add() {
      console.log(this.cowmothernumber.idCow)
      let config = {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        }
      }

      let data = {
        "idCowMother": this.cowmothernumber.idCow,
        "birthDate": this.datebirth,
      }

      await axios.post("http://localhost:8085/births", data, config)
        .then((res) => {
          this.snackbar = true;
          this.getAll();
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        });

    }

  }
};
</script>