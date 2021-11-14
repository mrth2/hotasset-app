<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    user() {
      return this.$strapi.user
    }
  }
})
</script>

<template>
  <div>
    <section class="banner">
      <div class="container mx-auto">
        <div class="banner-inner">
          <div class="banner-content px-4 sm:px-6">
            <h1 class="banner__title">Every Play in the Marketing & Sales Playbook</h1>
            <p class="banner__desc">
              Dribbble is the leading destination to find &amp; showcase creative work and
              home to the world's
              best
              design professionals.
            </p>
            <a class="banner__btn btn-primary" href="/signup/new">Sign up</a>
          </div>
          <div class="banner-image">
            <img srcset="~/assets/images/homepage/hero-illustration.png 2x" alt class="mx-auto" />
          </div>
        </div>
      </div>
    </section>
    <main class="border-t relative">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="filter-subnav">
          <div class="filter-subnav-inner flex flex-row items-center justify-between">
            <div class="filter-views mr-10">
              <span
                class="btn-dropdown active:scale-95 active:ring-0 active:ring-transparent hover:ring-2 hover:ring-red-500"
              >
                <span>Popular</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  role="img"
                  class="icon btn-dropdown-caret"
                >
                  <path
                    d="M21.5265 8.77171C22.1578 8.13764 22.1578 7.10962 21.5265 6.47555C20.8951 5.84148 19.8714 5.84148 19.24 6.47555L11.9999 13.7465L4.75996 6.47573C4.12858 5.84166 3.10492 5.84166 2.47354 6.47573C1.84215 7.10979 1.84215 8.13782 2.47354 8.77188L10.8332 17.1671C10.8408 17.1751 10.8486 17.183 10.8565 17.1909C11.0636 17.399 11.313 17.5388 11.577 17.6103C11.5834 17.6121 11.5899 17.6138 11.5964 17.6154C12.132 17.7536 12.7242 17.6122 13.1435 17.1911C13.1539 17.1807 13.1641 17.1702 13.1742 17.1596L21.5265 8.77171Z"
                  />
                </svg>
              </span>
              <div class="btn-dropdown-options">
                <ul>
                  <li>
                    <a href="#" class="btn-dropdown-option__link active">Popular</a>
                  </li>
                  <li class>
                    <a href="#" class="btn-dropdown-option__link">Trending</a>
                  </li>
                  <li class>
                    <a href="#" class="btn-dropdown-option__link">Latest</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="filter-categories relative text-center overflow-x-auto overflow-y-hidden">
              <ul
                class="overflow-x-auto overflow-y-hidden whitespace-nowrap px-1 flex justify-between"
              >
                <li class="inline-block">
                  <a class="filter-categories__link active">All</a>
                </li>
                <li class="inline-block">
                  <a class="filter-categories__link">Display</a>
                </li>
                <li class="inline-block">
                  <a class="filter-categories__link">Native</a>
                </li>
                <li class="inline-block">
                  <a class="filter-categories__link">Social</a>
                </li>
                <li class="inline-block">
                  <a class="filter-categories__link">Whitepaper</a>
                </li>
                <li class="inline-block">
                  <a class="filter-categories__link">Landing Page</a>
                </li>
              </ul>
            </div>
            <div
              class="filter-settings active:scale-95 active:ring-0 active:ring-transparent hover:ring-2 hover:ring-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                role="img"
                class="icon filter-icon icon-14"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 6C0 5.17157 0.671573 4.5 1.5 4.5H22.5C23.3284 4.5 24 5.17157 24 6C24 6.82843 23.3284 7.5 22.5 7.5H1.5C0.671573 7.5 0 6.82843 0 6ZM3 12C3 11.1716 3.67157 10.5 4.5 10.5H19.5C20.3284 10.5 21 11.1716 21 12C21 12.8284 20.3284 13.5 19.5 13.5H4.5C3.67157 13.5 3 12.8284 3 12ZM7.5 16.5C6.67157 16.5 6 17.1716 6 18C6 18.8284 6.67157 19.5 7.5 19.5H16.5C17.3284 19.5 18 18.8284 18 18C18 17.1716 17.3284 16.5 16.5 16.5H7.5Z"
                />
              </svg>
              <span class="label" title="Filters">Filters</span>
            </div>
          </div>
        </div>
        <div class="shot-filters">
          <form action class="shot-filters-form">
            <fieldset class="find-shots-assets-type">
              <label for class="shot-filter-form-label">Asset Type</label>
              <select id name class="shot-filter-form-control">
                <option value>Image</option>
              </select>
            </fieldset>
            <fieldset class="find-shots-channel">
              <label for class="shot-filter-form-label">Channel</label>
              <select id name class="shot-filter-form-control">
                <option value>Social</option>
              </select>
            </fieldset>
            <fieldset class="find-shots-downloads">
              <label for class="shot-filter-form-label">Downloads</label>
              <select id name class="shot-filter-form-control">
                <option value>Yes</option>
              </select>
            </fieldset>
            <fieldset class="find-shots-something">
              <label for class="shot-filter-form-label">Something</label>
              <select id name class="shot-filter-form-control">
                <option value>All</option>
              </select>
            </fieldset>
          </form>
        </div>
        <div class="shots-grid">
          <div class="shots-grid-row grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            <div class="shot-item">
              <div class="shot-thumbnail group">
                <figure>
                  <img src="~/assets/images/upload/1.png" alt />
                </figure>
                <a class="shot-thumbnail__link" href="#"></a>
                <div class="shot-thumbnail-overlay">
                  <div class="shot-thumbnail-overlay-content">
                    <div class="shot-title">Asset Type Name Asset Type Name Asset Type Name</div>
                    <div class="shot-action">
                      <a class="like-shot" itle="Like this shot">
                        <svg
                          width="18"
                          height="18"
                          xmlns="http://www.w3.org/2000/svg"
                          enable-background="new 0 0 24 24"
                          viewBox="0 0 24 24"
                          role="img"
                          class="icon"
                        >
                          <path
                            d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="shot-details-container">
                <p
                  class="shots-item__desc"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor di...</p>
                <div class="flex items-center justify-between">
                  <div class="user-information">
                    <a href class="user-infor__avatar">
                      <img src="~/assets/images/upload/1.png" alt width="24" height="24" />
                    </a>
                    <a href class="user-info__name">masump</a>
                  </div>
                  <div class="shot-statistics">
                    <a href>
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        viewBox="0 0 24 24"
                        role="img"
                        class="icon fill-current shot-tools-icon"
                      >
                        <path
                          d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                        />
                      </svg>
                    </a>
                    <span>223</span>
                  </div>
                </div>
              </div>
            </div>
            <!--End .shot-item-->
            <div class="shot-item">
              <div class="shot-thumbnail group">
                <figure>
                  <img src="~/assets/images/upload/1.png" alt />
                </figure>
                <a class="shot-thumbnail__link" href="#"></a>
                <div class="shot-thumbnail-overlay">
                  <div class="shot-thumbnail-overlay-content">
                    <div class="shot-title">Asset Type Name Asset Type Name Asset Type Name</div>
                    <div class="shot-action">
                      <a class="like-shot liked" itle="Like this shot">
                        <svg
                          width="18"
                          height="18"
                          xmlns="http://www.w3.org/2000/svg"
                          enable-background="new 0 0 24 24"
                          viewBox="0 0 24 24"
                          role="img"
                          class="icon"
                        >
                          <path
                            d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="shot-details-container">
                <p
                  class="shots-item__desc"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor di...</p>
                <div class="flex items-center justify-between">
                  <div class="user-information">
                    <a href class="user-infor__avatar">
                      <img src="~/assets/images/upload/1.png" alt width="24" height="24" />
                    </a>
                    <a href class="user-info__name">masump</a>
                  </div>
                  <div class="shot-statistics">
                    <a href>
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        viewBox="0 0 24 24"
                        role="img"
                        class="icon fill-current shot-tools-icon"
                      >
                        <path
                          d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                        />
                      </svg>
                    </a>
                    <span>223</span>
                  </div>
                </div>
              </div>
            </div>
            <!--End .shot-item-->
            <div class="shot-item">
              <div class="shot-thumbnail group">
                <figure>
                  <img src="~/assets/images/upload/1.png" alt />
                </figure>
                <a class="shot-thumbnail__link" href="#"></a>
                <div class="shot-thumbnail-overlay">
                  <div class="shot-thumbnail-overlay-content">
                    <div class="shot-title">Asset Type Name Asset Type Name Asset Type Name</div>
                    <div class="shot-action">
                      <a class="like-shot" itle="Like this shot">
                        <svg
                          width="18"
                          height="18"
                          xmlns="http://www.w3.org/2000/svg"
                          enable-background="new 0 0 24 24"
                          viewBox="0 0 24 24"
                          role="img"
                          class="icon"
                        >
                          <path
                            d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="shot-details-container">
                <p
                  class="shots-item__desc"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor di...</p>
                <div class="flex items-center justify-between">
                  <div class="user-information">
                    <a href class="user-infor__avatar">
                      <img src="~/assets/images/upload/1.png" alt width="24" height="24" />
                    </a>
                    <a href class="user-info__name">masump</a>
                  </div>
                  <div class="shot-statistics">
                    <a href>
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        viewBox="0 0 24 24"
                        role="img"
                        class="icon fill-current shot-tools-icon"
                      >
                        <path
                          d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                        />
                      </svg>
                    </a>
                    <span>223</span>
                  </div>
                </div>
              </div>
            </div>
            <!--End .shot-item-->
            <div class="shot-item">
              <div class="shot-thumbnail group">
                <figure>
                  <img src="~/assets/images/upload/1.png" alt />
                </figure>
                <a class="shot-thumbnail__link" href="#"></a>
                <div class="shot-thumbnail-overlay">
                  <div class="shot-thumbnail-overlay-content">
                    <div class="shot-title">Asset Type Name Asset Type Name Asset Type Name</div>
                    <div class="shot-action">
                      <a class="like-shot" itle="Like this shot">
                        <svg
                          width="18"
                          height="18"
                          xmlns="http://www.w3.org/2000/svg"
                          enable-background="new 0 0 24 24"
                          viewBox="0 0 24 24"
                          role="img"
                          class="icon"
                        >
                          <path
                            d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="shot-details-container">
                <p
                  class="shots-item__desc"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor di...</p>
                <div class="flex items-center justify-between">
                  <div class="user-information">
                    <a href class="user-infor__avatar">
                      <img src="~/assets/images/upload/1.png" alt width="24" height="24" />
                    </a>
                    <a href class="user-info__name">masump</a>
                  </div>
                  <div class="shot-statistics">
                    <a href>
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        viewBox="0 0 24 24"
                        role="img"
                        class="icon fill-current shot-tools-icon"
                      >
                        <path
                          d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                        />
                      </svg>
                    </a>
                    <span>223</span>
                  </div>
                </div>
              </div>
            </div>
            <!--End .shot-item-->
            <div class="shot-item">
              <div class="shot-thumbnail group">
                <figure class="shot-thumnail-without-container pdf">
                  <div class="shot-thumnail-without-img">
                    <img src="~/assets/images/icons/pdf.svg" alt />
                    <span>Some_Document.pdf</span>
                  </div>
                  <img src="~/assets/images/icons/pdf.svg" alt class="shot-thumbnail-icon" />
                </figure>
                <a class="shot-thumbnail__link" href="#"></a>
              </div>

              <div class="shot-details-container">
                <p
                  class="shots-item__desc"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor di...</p>
                <div class="flex items-center justify-between">
                  <div class="user-information">
                    <a href class="user-infor__avatar">
                      <img src="~/assets/images/upload/1.png" alt width="24" height="24" />
                    </a>
                    <a href class="user-info__name">masump</a>
                  </div>
                  <div class="shot-statistics">
                    <a href>
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        viewBox="0 0 24 24"
                        role="img"
                        class="icon fill-current shot-tools-icon"
                      >
                        <path
                          d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                        />
                      </svg>
                    </a>
                    <span>223</span>
                  </div>
                </div>
              </div>
            </div>
            <!--End .shot-item-->
            <div class="shot-item">
              <div class="shot-thumbnail group">
                <figure class="shot-thumnail-without-container csv">
                  <div class="shot-thumnail-without-img">
                    <img src="~/assets/images/icons/csv.svg" alt />
                    <span>Some_Document.csv</span>
                  </div>
                  <img src="~/assets/images/icons/csv.svg" alt class="shot-thumbnail-icon" />
                </figure>
                <a class="shot-thumbnail__link" href="#"></a>
              </div>

              <div class="shot-details-container">
                <p
                  class="shots-item__desc"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor di...</p>
                <div class="flex items-center justify-between">
                  <div class="user-information">
                    <a href class="user-infor__avatar">
                      <img src="~/assets/images/upload/1.png" alt width="24" height="24" />
                    </a>
                    <a href class="user-info__name">masump</a>
                  </div>
                  <div class="shot-statistics">
                    <a href>
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        viewBox="0 0 24 24"
                        role="img"
                        class="icon fill-current shot-tools-icon"
                      >
                        <path
                          d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                        />
                      </svg>
                    </a>
                    <span>223</span>
                  </div>
                </div>
              </div>
            </div>
            <!--End .shot-item-->
            <div class="shot-item">
              <div class="shot-thumbnail group">
                <figure class="shot-thumnail-without-container ppt">
                  <div class="shot-thumnail-without-img">
                    <img src="~/assets/images/icons/ppt.svg" alt />
                    <span>Some_Document.ppt</span>
                  </div>
                  <img src="~/assets/images/icons/ppt.svg" alt class="shot-thumbnail-icon" />
                </figure>
                <a class="shot-thumbnail__link" href="#"></a>
              </div>

              <div class="shot-details-container">
                <p
                  class="shots-item__desc"
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor di...</p>
                <div class="flex items-center justify-between">
                  <div class="user-information">
                    <a href class="user-infor__avatar">
                      <img src="~/assets/images/upload/1.png" alt width="24" height="24" />
                    </a>
                    <a href class="user-info__name">masump</a>
                  </div>
                  <div class="shot-statistics">
                    <a href>
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        enable-background="new 0 0 24 24"
                        viewBox="0 0 24 24"
                        role="img"
                        class="icon fill-current shot-tools-icon"
                      >
                        <path
                          d="m18.199 2.04c-2.606-.284-4.262.961-6.199 3.008-2.045-2.047-3.593-3.292-6.199-3.008-3.544.388-6.321 4.43-5.718 7.96.966 5.659 5.944 9 11.917 12 5.973-3 10.951-6.341 11.917-12 .603-3.53-2.174-7.572-5.718-7.96z"
                        />
                      </svg>
                    </a>
                    <span>223</span>
                  </div>
                </div>
              </div>
            </div>
            <!--End .shot-item-->
          </div>
        </div>
        <div class="infinite-login-actions">
          <a class="btn-primary" href="/signup/new">Sign up to continue</a>
          <a href="/session/new">or sign in</a>
        </div>
      </div>
    </main>
  </div>
</template>