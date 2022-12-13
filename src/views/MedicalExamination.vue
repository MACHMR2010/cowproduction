<template>
  <v-container fluid>
    <v-row class="mt-12">
      <v-col cols="3" sm="3" md="3">
        <v-form ref="form" lazy-validation class="mt-15">
          <v-row>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="examinationday"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="examinationday"
                  label="يوم الفحص"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  class="mx-12"
                  solo
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="examinationday"
                no-title
                scrollable
                :min="this.mindate"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.menu.save(examinationday)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-row>
          <v-row>
            <v-text-field
              v-model="pathology"
              label="المرض"
              outlined
              dense
              required
              class="mx-12"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-select 
          v-model="cow" 
          :items="cows" 
          label="رقم البقرة " 
          class="mx-12" 
          item-value="idCow"
          item-text="idCow"
          return-object
          single-line
          outlined dense required>
          </v-select>
          </v-row>
          <v-row>
            <v-btn color="success" class="mx-12" v-on:click="addOrUpdate">{{btnmessage}}</v-btn>
          </v-row>
        </v-form>
      </v-col>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">يوم الفحص</th>
                <th class="text-left">المرض</th>
                <th class="text-left">البقرة</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in exams" :key="item.idCow">
                <td>{{ item.examDay.substr(0, 10) }}</td>
                <td>{{ item.pathology }}</td>
                <td>{{ item.idCow }}</td>
                <td><v-btn v-on:click="updateField(item.examDay, item.pathology, item.idCow, item._id)">تحديث</v-btn></td>
                <td><v-btn color="error" v-on:click="deleteexam(item._id)">حذف</v-btn></td>
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
      cows:[],
      idtoupdate:null,
      cow:null,
      menu: false,
      btnmessage : "تسجيل",
      pathology:null,
      examinationday: null,
      mindate: new Date(new Date().getTimezoneOffset()- Date.now() * 60000)
        .toISOString()
        .substr(0, 10),
        exams: [],
    };
  },
  mounted() {
    this.getAll();
  },

  methods:{

    addOrUpdate(){
        if(this.idtoupdate){
          this.updateExam();
        }else{
          this.addExam();
        }
    },

    async updateExam(){
      let config = {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        }
      }

      let data = {
        "examDay": this.examinationday,
        "idCow": this.cow.idCow,
        "pathology": this.pathology
      }

      await axios.put("http://localhost:8085/exams/" + this.idtoupdate, data, config)
        .then(() => {
          this.getAll();
        })
        .catch((err) => {
          console.log(err)
        });

        this.btnmessage = "تسجيل";
        this.idtoupdate = null;
    },

    updateField(date, pathology, idcow, id){
      this.examinationday = date.substr(0, 10);
      this.pathology = pathology;
      this.cow = idcow;
      this.idtoupdate = id;
      this.btnmessage = "تحديث";
    },

    async addExam(){

      let config = {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        }
      }

      let data = {
        "examDay": this.examinationday,
        "idCow": this.cow.idCow,
        "pathology": this.pathology
      }

      await axios.post("http://localhost:8085/exams", data, config)
        .then(() => {
          this.getAll();
        })
        .catch((err) => {
          console.log(err)
        });
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
    async deleteexam(id) {
      await axios.delete("http://localhost:8085/exams/" + id).then((res) => {
        console.log(res);
        this.getAll();
      })
        .catch((err) => {
          console.log(err)
        });
    },
    async getAll() {
      await axios.get("http://localhost:8085/exams").then((res) => {
        console.log(res)
        this.exams = res.data;
        this.getAllRaces();
      })
        .catch((err) => {
          console.log(err)
        });

    },
  }
};
</script>