<template>
  <v-card color="grey lighten-4" flat tile>
    <v-toolbar dense elevation="4">
      <v-toolbar-title to="/">تسجيل البقر</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text color="blue" to="/milkproduction"
          ><span>انتاج الحليب اليومي  </span></v-btn
        >
        <v-btn text color="blue" to="/birthregistration"
          ><span>  تسجيل الولادات  </span></v-btn
        >
        <v-btn text color="blue" to="/medicalexamination"><span>الفحص الطبي</span></v-btn>

        <v-btn text color="blue" to="/cowrecording">تسجيل البقر</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </v-card>
</template>