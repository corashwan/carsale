import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import {Translate} from './shared/translate.pipe';
import {Limit} from './shared/limit.pipe';
import { HttpClientModule } from '@angular/common/http';
import { AuctionsComponent } from './pages/auctions/auctions/auctions.component';
import { SingleAuctionsComponent } from './pages/auctions/single-auctions/single-auctions.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SubCategoryComponent } from './pages/categories/sub-category/sub-category.component';
import { ChildCategoryComponent } from './pages/categories/sub-category/child-category/child-category.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { AdvertiseWithUsComponent } from './pages/advertise-with-us/advertise-with-us.component';
import { HomeSliderComponent } from './components/home-slider/home-slider.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { EditAuctionsComponent } from './modules/auctions/edit-auctions/edit-auctions.component';
import { CreateAdsComponent } from './modules/ads/create-ads/create-ads.component';
import { EditAdsComponent } from './modules/ads/edit-ads/edit-ads.component';
import { AccountComponent } from './pages/account/account.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { AccountAuctionsComponent } from './pages/account/account-auctions/account-auctions.component';
import { AccountFavoritesComponent } from './pages/account/account-favorites/account-favorites.component';
import { AccountAdsComponent } from './pages/account/account-ads/account-ads.component';
import { FeaturedAdsComponent } from './components/home/featured-ads/featured-ads.component';
import { RecentAdsComponent } from './components/home/recent-ads/recent-ads.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Filter } from './shared/filter.pipe';
import { DynamicTranslate } from './shared/dynamicTranslate.pipe';
import { GetResults } from './shared/getResults.pipe';

import { LoadMoreAds } from './shared/loadMoreAds.pipe';
import { ProductInformationComponent } from './pages/product-information/product-information.component';
import { CreateAdComponent } from './pages/ads/create-ad/create-ad.component';
import { UpdateAdComponent } from './pages/ads/update-ad/update-ad.component';
import { AddAuctionComponent } from './pages/account/account-auctions/add-auction/add-auction.component';
import { SearchComponent } from './pages/search/search.component';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    ContactComponent,
    PageNotFoundComponent,
    Translate,
    Limit,
    LoadMoreAds,
    GetResults,
    AuctionsComponent,
    SingleAuctionsComponent,
    FaqsComponent,
    CategoriesComponent,
    SubCategoryComponent,
    ChildCategoryComponent,
    AboutComponent,
    TermsComponent,
    PrivacyPolicyComponent,
    AdvertiseWithUsComponent,
    HomeSliderComponent,
    NewsletterComponent,
    EditAuctionsComponent,
    CreateAdsComponent,
    EditAdsComponent,
    AccountComponent,
    AccessDeniedComponent,
    AccountAuctionsComponent,
    AccountFavoritesComponent,
    AccountAdsComponent,
    FeaturedAdsComponent,
    RecentAdsComponent,
    Filter,
    DynamicTranslate,
    ProductInformationComponent,
    CreateAdComponent,
    UpdateAdComponent,
    AddAuctionComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
