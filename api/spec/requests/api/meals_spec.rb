require 'rails_helper'

RSpec.describe 'Api::Meals', type: :request do
  let(:user) { create(:user) }

  describe 'GET /api/meals' do
    it '200を返す（自分のデータのみ）' do
      sign_in user
      create_list(:meal, 3, user: user)
      create(:meal)  # 別ユーザーの記録

      get '/api/meals'
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).length).to eq(3)
    end

    it '未ログインは401を返す' do
      get '/api/meals'
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'GET /api/meals/:id' do
    let(:meal) { create(:meal, user: user) }

    it '200を返す' do
      sign_in user
      get "/api/meals/#{meal.id}"
      expect(response).to have_http_status(:ok)
    end

    it '他ユーザーのデータは取得できない' do
      sign_in user
      other_meal = create(:meal)
      get "/api/meals/#{other_meal.id}"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'POST /api/meals' do
    context '有効なパラメータ' do
      let(:valid_params) { { meal: { description: '玄米ご飯', eaten_at: Date.today } } }

      it '201を返してレコードが増える' do
        sign_in user
        expect {
          post '/api/meals', params: valid_params, as: :json
        }.to change(user.meals, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context '無効なパラメータ' do
      it '422を返す' do
        sign_in user
        post '/api/meals', params: { meal: { description: '' } }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end

    it '未ログインは401を返す' do
      post '/api/meals', params: { meal: { description: '玄米', eaten_at: Date.today } }, as: :json
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe 'PATCH /api/meals/:id' do
    let(:meal) { create(:meal, user: user) }

    it '200を返してdescriptionが更新される' do
      sign_in user
      patch "/api/meals/#{meal.id}", params: { meal: { description: '更新後の食事' } }, as: :json
      expect(response).to have_http_status(:ok)
      expect(meal.reload.description).to eq('更新後の食事')
    end
  end

  describe 'DELETE /api/meals/:id' do
    let!(:meal) { create(:meal, user: user) }

    it '204を返してレコードが減る' do
      sign_in user
      expect {
        delete "/api/meals/#{meal.id}"
      }.to change(user.meals, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
