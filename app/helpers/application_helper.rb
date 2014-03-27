module ApplicationHelper
  
  # http://stackoverflow.com/questions/3705898/best-way-to-add-current-class-to-nav-in-rails-3
  def nav_tabs(tabs=[], admin)
    html = []
    tabs.each do |tab|
      css_admin = "admin" if admin
      css_active = "active" if request.fullpath.split(/[\??]/)[0] == tab[:path]
      css = nil
      if css_admin
        if css_active
          css = css_admin + " " + css_active
        else
          css = css_admin
        end
      else
        if css_active
          css = css_active
        end
      end

      html << (content_tag :li, link_to(tab[:name], tab[:path]), :class => css)
    end

    html.join.html_safe
  end

  def nav_admin_tabs(tabs = [])
    html = []
    tabs.each do |tab|
      #params[:controller]
      css = "admin " + ("active" if request.fullpath.split(/[\??]/)[0] == tab[:path])
      html << (content_tag :li, link_to(tab[:name], tab[:path]), :class => css)
    end

    html.join.html_safe
  end

end
