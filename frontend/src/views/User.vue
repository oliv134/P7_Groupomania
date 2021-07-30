<template>
  <v-container
    class="fill-height"
    fluid
    align-content-xs-start
    align-content-mg-center
  >
    <v-row justify="center">
      <v-col sm="8">
        <v-card class="elevation-6">
          <v-row class="fill-height">
            <v-col
              cols="12"
              md="4"
              class="teal accent-3"
              order="1"
              order-md="0"
            >
              <v-card-text class="white--text mt-12 text-center">
                <v-avatar color="indigo" size="128">
                  <span class="white--text display-1" v-if="!imageUrl">
                    {{ $store.state.user.initial }}
                  </span>
                  <v-img
                    v-if="imageUrl"
                    :src="imageUrl"
                    :alt="$store.state.user.name"
                  >
                  </v-img>
                  <!-- <span class="white--text text-h5">CJ</span> -->
                </v-avatar>
              </v-card-text>
              <div class="text-center mt-6">
                <v-btn rounded outlined dark @click="addImage" class="mb-3"
                  >Modifier mon avatar</v-btn
                >
                <input
                  ref="file"
                  class="d-none"
                  type="file"
                  accept="image/png, image/jpeg, image/bmp, image/gif"
                  @change="onFileChanged"
                />
              </div>
              <div class="text-center mt-6">
                <v-btn rounded outlined dark @click="delImage" class="mb-3"
                  >Supprimer mon avatar</v-btn
                >
              </div>
              <div class="text-center mt-6">
                <v-dialog v-model="dialog" persistent max-width="290">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      rounded
                      dark
                      class="mb-3"
                      v-bind="attrs"
                      v-on="on"
                      >Supprimer mon profil</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title class="headline"
                      >Attention !</v-card-title
                    >
                    <v-card-text
                      >La suppression du compte est irreversible.
                      Souhaitez vous continuez ?</v-card-text
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-1" text @click="dialog = false"
                        >Non</v-btn
                      >
                      <v-btn color="green darken-1" text @click="delUser"
                        >Oui</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </v-col>

            <v-col cols="12" md="8">
              <v-card-title class="justify-center align-start">
                <h1
                  class="mt-8 text-center display-2 teal--text text--accent-3"
                >
                  Mon Profil
                </h1>
              </v-card-title>
              <v-card-subtitle class="mt-4">
                <h4 class="text-center mt-4">Renseignez vos informations</h4>
              </v-card-subtitle>
              <v-card-text class="mt-4">
                <v-form>
                  <v-text-field
                    label="Nom"
                    name="name"
                    v-model="name"
                    prepend-icon="person"
                    type="text"
                    color="teal accent-3"
                  />
                  <v-text-field
                    label="Email"
                    name="email"
                    v-model="email"
                    prepend-icon="email"
                    type="text"
                    color="teal accent-3"
                  />
                  <v-text-field
                    id="password"
                    label="Mot de passe"
                    name="password"
                    v-model="password"
                    prepend-icon="lock"
                    type="password"
                    color="teal accent-3"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn
                  rounded
                  color="teal accent-3"
                  dark
                  class="px-5 mb-3"
                  @click.prevent="updateUser"
                >
                  Valider
                </v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      
    </v-row>
    
  </v-container>
</template>

<script>
import Auth from "../services/Auth.js";
export default {
  data() {
    return {
      step: 1,
      name: this.$store.state.user.name,
      email: this.$store.state.user.email,
      imageUrl: this.$store.state.user.imageUrl,
      imageSrc: null,
      upImageUrl: this.$store.state.user.imageUrl,
      password: null,
      errorMessage: null,
      isValid: true,
      message: null,
      dialog: false,
      back: false
    };
  },

  methods: {
    addImage() {
      this.$refs.file.click();
    },
    delImage() {
      this.imageSrc = null;
      this.imageUrl = null;
    },
    onFileChanged() {
      this.imageSrc = this.$refs.file.files[0];
      this.imageUrl = URL.createObjectURL(this.imageSrc);
      console.log(this.imageUrl);
      // do something
    },
    async updateUser() {
      try {
        const formData = new FormData();
        formData.append("name", this.name);
        formData.append("email", this.email);

        if (this.password != null) {
          formData.append("password", this.password);
        }
        if (this.imageUrl != this.upImageUrl) {
          formData.append("image", this.imageSrc);
        }
        const response = await Auth.updateUser(
          this.$store.state.user.id,
          formData
        );
        this.message = response.data.message;
        this.$store.dispatch("setUser", response.data.user);
        this.$router.push("/posts");
      } catch (error) {
        this.errorMessage = error.response.data.error;
        // A voir ici un bottomSheet
        setTimeout(() => {
          this.errorMessage = "";
        }, 1500);
      }
    },
    async delUser() {
      await Auth.deleteUser(this.$store.state.user.id)
      this.dialog=false;
      this.$store.dispatch("logOut");
      this.$router.push('/');
    },
   
  },
  beforeCreate() {
    if (!this.$store.state.isLoggedIn) {
      this.$router.push("/");
    }
  },
};
</script>