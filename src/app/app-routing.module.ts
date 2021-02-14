import { AccountFavoritesComponent } from './pages/account/account-favorites/account-favorites.component';
import { AccountAuctionsComponent } from './pages/account/account-auctions/account-auctions.component';
import { AccountComponent } from './pages/account/account.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes , CanActivate } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PageNotFoundComponent  } from './pages/page-not-found/page-not-found.component';
import { AboutComponent  } from './pages/about/about.component';
import { TermsComponent  } from './pages/terms/terms.component';
import { PrivacyPolicyComponent  } from './pages/privacy-policy/privacy-policy.component';
import { AdvertiseWithUsComponent  } from './pages/advertise-with-us/advertise-with-us.component';
import { FaqsComponent  } from './pages/faqs/faqs.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { SubCategoryComponent } from './pages/categories/sub-category/sub-category.component';
import { ChildCategoryComponent } from './pages/categories/sub-category/child-category/child-category.component';
import { ProductInformationComponent } from './pages/product-information/product-information.component';
import { AuctionsComponent } from './pages/auctions/auctions/auctions.component';
import { AuthService } from './shared/services/auth/auth.service';
import { AccountAdsComponent } from './pages/account/account-ads/account-ads.component';
import { CreateAdComponent } from './pages/ads/create-ad/create-ad.component';
import { UpdateAdComponent } from './pages/ads/update-ad/update-ad.component';
import { SingleAuctionsComponent } from './pages/auctions/single-auctions/single-auctions.component';
import { AddAuctionComponent } from './pages/account/account-auctions/add-auction/add-auction.component';
import { SearchComponent } from './pages/search/search.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'contact-us', component: ContactComponent, canActivate:[AuthService] },
  { path: 'about', component: AboutComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'advertise-with-us', component: AdvertiseWithUsComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'account', component: AccountComponent },
  { path: 'account/ads', component: AccountAdsComponent },
  { path: 'account/my_auctions', component: AccountAuctionsComponent },
  { path: 'account/my_auctions/create', component: AddAuctionComponent },
  { path: 'account/favorites', component: AccountFavoritesComponent },
  { path: 'auctions', component: AuctionsComponent },
  { path: 'auctions/:id', component: SingleAuctionsComponent},
  { path: 'category/:id',component: CategoriesComponent},
  { path: 'category/:categoryId/:subcategoryId', component: SubCategoryComponent},
  { path: 'category/:categoryId/:subcategoryId/:sub_subcategoryId', component: ChildCategoryComponent},
  { path: 'category/:categoryId/:subcategoryId/:sub_subcategoryId/ads/:id', component: ProductInformationComponent},
  { path: 'ads/create', component: CreateAdComponent},
  { path: 'ads/update/:id', component: UpdateAdComponent},
  { path: 'search/:categorySearch/:keywords', component: SearchComponent},
  { path: '',   redirectTo: '/home', pathMatch: 'full' }, // redirect to `home`
  { path: '**', component: PageNotFoundComponent }// Wildcard route for a 404 page
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthService]
})
export class AppRoutingModule { }
