<template>
  <v-container
    fluid
    align-content-xs-start
    align-content-mg-center
    class="mt-8"
  >
    <v-row justify="center">
      <v-col cols="11" md="6">
        <v-card class="elevation-6">
          <v-row>
            <v-col cols="2" md="1" class="text-center px-0">
              <v-avatar
                @click.stop="$store.state.drawer = !$store.state.drawer"
                color="indigo"
              >
                <span
                  class="white--text headline"
                  v-if="!$store.state.user.imageUrl"
                >
                  {{ $store.state.user.initial }}
                </span>
                <v-img
                  v-if="$store.state.user.imageUrl"
                  :src="$store.state.user.imageUrl"
                  :alt="$store.state.user.name"
                  height="40"
                  max-width="40"
                  contain
                >
                </v-img>
                <!-- <span class="white--text text-h5">CJ</span> -->
              </v-avatar>
            </v-col>
            <v-col cols="10" md="11" class="grey lighten-5 px-lg-6 px-3">
              <v-form
                ref="postForm"
                @submit.prevent="onSubmit"
                enctype="multipart/form-data"
                class="validate"
              >
                <v-textarea
                  label="Que souhaitez-vous partager ?"
                  ref="contentInput"
                  auto-grow
                  outlined
                  rows="1"
                  v-model="content"
                  :rules="[rules.required]"
                  class="input-group--focused"
                  aria-label="Contenu du nouveau post"
                >
                </v-textarea>
                <v-img
                  class="rounded-lg"
                  max-height="300"
                  contain
                  :src="imageUrl"
                  v-if="imageUrl"
                  :alt="imageUrl"
                ></v-img>
                <v-row class="">
                  <v-col class="" cols="2" sm="1">
                    <v-tooltip bottom v-if="!imageUrl">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="addImage"
                          aria-label="Ajouter une image"
                        >
                        <v-icon>mdi-image</v-icon>
                        </v-btn>
                        <input
                          ref="file"
                          id="file"
                          class="d-none"
                          type="file" 
                          accept="image/gif"
                          @change="onFileChanged"
                        />
                      </template>
                      <span>Ajouter une image</span>
                    </v-tooltip>
                    <v-tooltip bottom v-if="imageUrl">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="delImage"
                          aria-label="Retirer l'image"
                        >
                          <v-icon color="red">mdi-image-off-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>Retirer l'image</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-divider class="mb-2"></v-divider>
                <v-row justify="end">
                  <v-col cols="6" md="3">
                    <v-btn
                      color="deep-purple"
                      @click="cancelUpdate"
                      v-if="imageUrl || content"
                    >
                      Annuler
                    </v-btn>
                  </v-col>
                  <v-col cols="6" md="4">
                    <v-btn
                      class=""
                      color="info"
                      @click="onSubmit"
                      :disabled="!content"
                    >
                      {{ validText }}
                      <template v-slot:loader>
                        <span class="custom-loader">
                          <v-icon light>mdi-cached</v-icon>
                        </span>
                      </template>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    content: null,
    isSelecting: false,
    rules: {
      required: (value) =>
        !!value || "Il faut quand même écrire quelque chose.",
    },
    imageSrc: null,
    imageUrl: null,
  }),
  props: {
    postId: {
      type: Number,
    },
    update: {
      type: Boolean,
    },
    upContent: {
      type: String,
    },
    upImageUrl: {
      type: String,
    },
  },
  methods: {
    addImage() {
      this.$refs.file.click();
    },
    delImage() {
      this.imageSrc = null;
      this.imageUrl = null;
      //this.$refs.file.value = null;
    },
    onFileChanged() {
      console.log("fiel changed")
      this.imageSrc = this.$refs.file.files[0];
      this.imageUrl = URL.createObjectURL(this.imageSrc);
    },
    onSubmit() {
      const formData = new FormData();
      if (this.content) {
        formData.append("content", this.content);

        if (this.update) {
          formData.append("imageUrl", this.imageUrl);
          formData.append("image", this.imageSrc);
          this.$store
            .dispatch("updatePost", { postId: this.postId, formData: formData })
            .then(this.$emit("updatePost"));
        } else {
          if (this.imageSrc) {
            formData.append("image", this.imageSrc);
          }
          this.$store.dispatch("createPost", formData).then();
          this.delImage();
          this.$refs.postForm.reset();
        }
      }
    },
    cancelUpdate() {
      if (!this.update) {
        this.delImage();
        this.$refs.postForm.reset();
      }
      this.$emit("updatePost");
    },
  },
  computed: {
    validText() {
      return this.update ? "...Poster" : "Poster";
    },
  },
  beforeMount() {
    if (this.update) {
      this.content = this.upContent;
      this.imageUrl = this.upImageUrl === "null" ? null : this.upImageUrl;
    }
  },
  mounted() {
    this.$refs.contentInput.focus();
  },
};
</script>
