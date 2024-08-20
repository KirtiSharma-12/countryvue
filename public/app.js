// app.js
const showSelected = {
  template: `
  <section class="country-section">
    <div class="select-country">
      <select class="form-control" v-model="selectedCountry" @change="fetchCountryDetails">
        <option value="" disabled>Select a country</option>
        <option v-for="country in countries" :key="country.id" :value="country.id">{{ country.name }}</option>
      </select>
    </div>
    <div class="country-details">
      <div v-if="!selectedCountry" class="no-country">Select a country to view details.</div>
      <div v-else>
        <div class="country-info">
          <h2>{{ selectedCountryName }}</h2>
          <p class="country-rank">Rank: {{ selectedCountryRank }}</p>
        </div>
        <div class="country-image" v-if="selectedCountryImage">
          <img :src="selectedCountryImage" alt="Country Image">
        </div>
      </div>
    </div>
  </section>
  `,
  props: ["countries"],
  data() {
    return {
      selectedCountry: "",
      selectedCountryName: "",
      selectedCountryImage: "",
      selectedCountryRank: "",
    };
  },
  methods: {
    fetchCountryDetails() {
      fetch(`http://127.0.0.1:8080/countries/${this.selectedCountry}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          // console.log(response);
          this.selectedCountryName = response.data[0].name;
          this.selectedCountryImage = response.data[0].flag;
          this.selectedCountryRank = response.data[0].rank;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};

const addCountry = {
  template: `
  <section class="add-country-section">
  <div class="add-country-form">
    <h3>Add a New Country</h3>
    <form id="add-country" @submit.prevent="addCountry">
      <div class="form-columns">
        <div class="form-group">
          <label for="newCountryName">Country Name:</label>
          <input class="form-control" type="text" id="newCountryName" v-model="newCountry.name" :class="{ 'error': errorField.name }">
          <div class="error-message" v-if="errorField.name">{{ errorField.name }}</div>
        </div>

        <div class="form-group">
          <label for="newCountryContinent">Continent:</label>
          <select class="form-control" v-model="newCountry.continent">
            <option v-for="continent in continents" :key="continent" :value="continent">{{ continent }}</option>
          </select>
        </div>

      <div class="form-columns">
        <div class="form-group">
          <label for="newCountryRank">Rank:</label>
          <input class="form-control" type="number" id="newCountryRank" v-model="newCountry.rank" :class="{ 'error': errorField.rank }">
          <div class="error-message" v-if="errorField.rank">{{ errorField.rank }}</div>
        </div>

        <div class="form-group">
          <label for="newCountryImage">Country Image (JPG/PNG, Max 4MB):</label>
          <input class="form-control" type="file" id="newCountryImage" ref="fileInput" @change="onFileChange" :class="{ 'error': errorField.image }">
          <div class="error-message" v-if="errorField.image">{{ errorField.image }}</div>
        </div>
      </div>        
      </div>

      <div class="form-group flex-center">
        <button class="btn-submit" type="submit">Add Country</button>
      </div>
    </form>
  </div>
</section>
  `,
  props: ["continents"],
  data() {
    return {
      newCountry: { name: "", image: "", continent: "", rank: "" },
      errorField: {
        name: "",
        image: "",
        rank: "",
      },
      selectedFile: null,
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];

      if (file) {
        const allowedFormats = ["image/jpeg", "image/png"];
        const maxFileSize = 4 * 1024 * 1024; // 4 MB in bytes

        if (allowedFormats.includes(file.type) && file.size <= maxFileSize) {
          this.selectedFile = file;
        } else {
          alert(
            "Please choose a valid image file (JPG or PNG) with a maximum size of 4 MB."
          );
          this.$refs.fileInput.value = ""; // Clear the file input
        }
      }
    },
    validateData() {
      const countryName = this.newCountry.name.trim();
      const countryRank = Number(this.newCountry.rank);
      const countryContinent = this.newCountry.continent;

      if (countryName.length < 3 || countryName.length > 20) {
        alert("Country name must be between 3 and 20 characters.");
        return false;
      }
      if (countryRank == 0 || countryRank < 0) {
        alert("Rank cannot be 0 or less than 0.");
        return false;
      }
      if (countryContinent == "") {
        alert("Continent cannot be empty");
        return false;
      }
      if (this.selectedFile == null) {
        alert("Need to upload Image");
        return false;
      }
      return true;
    },
    addCountry() {
      try {
        this.errorField = {
          name: "",
          image: "",
          rank: "",
        };
        if (!this.validateData()) {
          return;
        }

        const formData = new FormData();
        formData.append("name", this.newCountry.name);
        formData.append("image", this.selectedFile);
        formData.append("rank", Number(this.newCountry.rank));
        formData.append("continent", this.newCountry.continent);

        fetch("http://127.0.0.1:8080/countries", {
          method: "POST",
          body: formData,
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            if (res.status == "success") {
              alert(res.message);
              this.resetForm();
              this.$emit("fetchData");
            } else {
              console.log(res)
              this.errorField[res.errorFields[0]] = res.message;
            }

            return;
          });
      } catch (error) {
        console.error(error);
      }
    },
    resetForm() {
      this.newCountry = { name: "", image: "", continent: "", rank: "" };
      this.selectedFile = null;
      document.getElementById("newCountryImage").value = "";
    },
  },
};
new Vue({
  el: "#app",
  template: ` 
  <div class="container">
    <showSelected :countries="countries" />
    <addCountry :continents="continents" @fetchData="fetchData"/>
  </div>`,
  data: {
    countries: [],
    continents: [],
  },
  methods: {
    fetchData() {
      const urls = [
        "http://127.0.0.1:8080/countries",
        "http://127.0.0.1:8080/countries/all",
      ];
      const fetchPromises = urls.map((url) =>
        fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      Promise.all(fetchPromises)
        .then((responses) => {
          // Handle responses here
          return Promise.all(responses.map((response) => response.json()));
        })
        .then((dataArray) => {
          const [res1, res2] = dataArray;
          if (res1.status == "success") {
            this.countries = res1.data;
          }

          if (res2.status == "success") {
            this.continents = [
              ...new Set(res2.data.map((country) => country.continent)),
            ];
          }
          // console.log(dataArray);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {},
  mounted() {
    this.fetchData();
  },
  components: {
    showSelected,
    addCountry,
  },
});
