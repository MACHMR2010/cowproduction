<template>
  <v-container fluid>
    <v-row class="mt-12">
      <v-col cols="3" sm="3" md="3">
        <v-form ref="form" lazy-validation class="mt-15">
          <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="cowday"
            transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="cowday" label="اليوم" readonly v-bind="attrs" v-on="on" class="mx-12"
                solo></v-text-field>
            </template>
            <v-date-picker v-model="cowday" no-title scrollable :min="this.mindate">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(cowday)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-text-field v-model="amountmilk" label="كمية الحليب باللتر" outlined dense required
            class="mx-12"></v-text-field>
          <v-btn color="success" class="mx-12" v-on:click="updateOrAdd">{{ btnmessage }}</v-btn>
        </v-form>
      </v-col>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th type = "number" class="text-left" >يوم</th>
                <th type = "number" class="text-left" >كمية الحليب باللتر</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in milk" :key="item.day">
                <td>{{ item.prodDate.substr(0, 10) }}</td>
                <td>{{ item.amount }}</td>
                <td><v-btn v-on:click="updateFields(item.amount, item.prodDate, item._id)">تحديث </v-btn></td>
                <td><v-btn color="error" v-on:click="deleteprod(item._id)">حذف</v-btn></td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      idToUpdate: null,
      isToUpdate: false,
      btnmessage: "تسجيل",
      amountmilk: 0,
      cowday: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      milk: [],
      menu: false,
      mindate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
    };
  },

  mounted() {
    this.getAll();
  },


  methods: {

    async deleteprod(id) {
      await axios.delete("http://localhost:8085/cowProds/" + id).then((res) => {
        console.log(res);
        this.getAll();
      })
        .catch((err) => {
          console.log(err)
        });
    },

    async add() {

      let config = {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        }
      }

      let data = {
        "amount": this.amountmilk,
        "prodDate": this.cowday
      }

      await axios.post("http://localhost:8085/cowProds", data, config)
        .then(() => {
          this.getAll();
        })
        .catch((err) => {
          console.log(err)
        });

    },
    updateOrAdd() {
      console.log(this.isToUpdate);
      if (this.isToUpdate) {
        this.update();
      } else {
        this.add();
      }

    },
    updateFields(amount, prodDate, id) {
      this.idToUpdate = id;
      this.isToUpdate = true;
      this.btnmessage = "تحديث";
      this.amountmilk = amount;
      this.cowday = prodDate.substr(0, 10);
    },
    async update() {

      let config = {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        }
      }

      let data = {
        "amount": this.amountmilk,
        "prodDate": this.cowday
      }

      await axios.put("http://localhost:8085/cowProds/" + this.idToUpdate, data, config)
        .then(() => {
          this.getAll();
        })
        .catch((err) => {
          console.log(err)
        });
      this.isToUpdate = false;
      this.btnmessage = "تسجيل";
      this.idToUpdate = null;

    },

    async getAll() {
      await axios.get("http://localhost:8085/cowProds").then((res) => {
        console.log(res)
        this.milk = res.data;
      })
        .catch((err) => {
          console.log(err)
        });

    },
  }
};
</script>